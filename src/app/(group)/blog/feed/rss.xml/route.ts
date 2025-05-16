import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { promises as fs } from 'fs'
import path from 'path'
import matter, { GrayMatterFile } from 'gray-matter'
import { marked } from 'marked'

export async function GET() {
  const { latestPostDate, rssItemsXml } = await fs
    .readdir(path.resolve(process.cwd(), 'src/posts'))
    .then(paths => paths.filter(filename => filename.endsWith('.md')))
    .then(paths =>
      Promise.all(
        paths.map(async filePath => {
          const parsed = await fs
            .readFile(
              path.resolve(process.cwd(), 'src/posts/', filePath),
              'utf8',
            )
            .then(matter)
            .then(extractGrayMatter)

          const origin = await getOrigin()

          parsed.frontmatter.href = `${origin}/blog/${path.basename(
            filePath,
            '.md',
          )}`
          return parsed
        }),
      ),
    )
    .then(getPostsXml)

  const body = getFeedXml({
    itemsXml: rssItemsXml,
    latestPostDate,
    blogUrl: `${getOrigin()}/blog`,
  })

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}

type BlogFrontmatter = GrayMatterFile<string>['data'] & {
  title?: string
  date?: string
  href: string
}

const extractGrayMatter = (data: GrayMatterFile<string>) => {
  return {
    frontmatter: data.data as BlogFrontmatter,
    markdownBody: data.content,
  }
}

const getOrigin = () =>
  headers().then(headersList => {
    const host = headersList.get('host')
    if (!host) {
      return 'http://localhost:3000'
    }
    return host.startsWith('localhost') ? `http://${host}` : `https://${host}`
  })

const getPostsXml = (posts: ReturnType<typeof extractGrayMatter>[]) => {
  const { rssItemsXml, latestPostDate } = posts.reduce(
    (acc, post) => {
      // Get post's date from frontmatter.
      const postDate =
        (post.frontmatter.date && new Date(post.frontmatter.date)) ?? ''

      // If post's date greater than any previous post's date, use current post's.
      const latestPostDate =
        postDate &&
        (!acc.latestPostDate ||
          postDate.getTime() > new Date(acc.latestPostDate).getTime())
          ? postDate.toUTCString()
          : acc.latestPostDate

      // Concatenate XML for current post to RSS string.
      const rssItemsXml = `${acc.rssItemsXml}
      <item>
        <title>${post.frontmatter.title ?? ''}</title>
        <link>${post.frontmatter.href}</link>
        ${postDate ? `<pubDate>${postDate.toUTCString()}</pubDate>` : ''}
        
        ${
          post.frontmatter.description
            ? `<description>${post.frontmatter.description}</description>`
            : ''
        }
        <content:encoded><![CDATA[${marked(
          post.markdownBody,
        )}]]></content:encoded>
      </item>`

      return {
        rssItemsXml,
        latestPostDate,
      }
    },
    { rssItemsXml: '', latestPostDate: '' },
  )

  return {
    rssItemsXml,
    latestPostDate,
  }
}

const getFeedXml = ({
  itemsXml,
  latestPostDate,
  blogUrl,
}) => `<?xml version="1.0" ?>
  <rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
      <title>Blog-Articles by Tobias Barth, Freelance Web Person</title>
	  <link>${blogUrl}</link>
	  <description>Modern web development with HTML, CSS and JavaScript. Mostly ReactJS</description>
	  <language>en</language>
	  <pubDate>${latestPostDate}</pubDate>
	  ${itemsXml}
    </channel>
  </rss>
`

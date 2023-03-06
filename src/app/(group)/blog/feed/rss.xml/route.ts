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
              'utf8'
            )
            .then(matter)
            .then(extractGrayMatter)
          parsed.frontmatter.href = `${getOrigin()}/blog/${path.basename(
            filePath,
            '.md'
          )}`
          return parsed
        })
      )
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

const getOrigin = () => {
  const host = headers().get('host')
  if (!host) {
    return 'http://localhost:3000'
  }
  return host.startsWith('localhost') ? `http://${host}` : `https://${host}`
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

const getPostsXml = (posts: ReturnType<typeof extractGrayMatter>[]) => {
  let latestPostDate: string = ''
  let rssItemsXml: string = ''
  posts.forEach(post => {
    let postDate: Date | undefined = undefined
    if (post.frontmatter.date) {
      postDate = new Date(post.frontmatter.date)
      if (
        !latestPostDate ||
        postDate.getTime() > new Date(latestPostDate).getTime()
      ) {
        latestPostDate = postDate.toUTCString()
      }
    }
    rssItemsXml += `
      <item>
        <title>${post.frontmatter.title}</title>
        <link>${post.frontmatter.href}</link>
        ${postDate ? `<pubDate>${postDate.toUTCString()}</pubDate>` : ''}
        
        ${
          post.frontmatter.description
            ? `<description>${post.frontmatter.description}</description>`
            : ''
        }
        <content:encoded><![CDATA[${marked(
          post.markdownBody
        )}]]></content:encoded>
      </item>`
  })
  return {
    rssItemsXml,
    latestPostDate,
  }
}

const extractGrayMatter = (data: GrayMatterFile<string>) => {
  return {
    frontmatter: data.data as BlogFrontmatter,
    markdownBody: data.content,
  }
}
type BlogFrontmatter = GrayMatterFile<string>['data'] & {
  title?: string
}

import { promises as fs } from 'fs'
import matter, { GrayMatterFile } from 'gray-matter'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { marked } from 'marked'

const getOrigin = (req: NextApiRequest) => {
  if (!req.headers.host) {
    return 'http://localhost:3000'
  }
  return req.headers.host.startsWith('localhost')
    ? `http://${req.headers.host}`
    : `https://${req.headers.host}`
}

export default function Feed() {
  return null
}

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest
  res: NextApiResponse
}) => {
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
          parsed.frontmatter.href = `${getOrigin(req)}/blog/${path.basename(
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
    blogUrl: `${getOrigin(req)}/blog`,
  })
  res.setHeader('Content-Type', 'text/xml')
  res.write(body)
  res.end()
  return { props: {} }
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
    let postDate: Date
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
        <pubDate>${postDate.toUTCString()}</pubDate>
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

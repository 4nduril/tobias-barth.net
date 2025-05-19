import { promises as fs } from 'fs'
import path from 'path'
import matter, { GrayMatterFile } from 'gray-matter'
import { RssIcon } from './RssIcon'
import Link from 'next/link'
import MainContent from '../../../components/MainContent'

export const metadata = {
  title: 'Articles by Tobias Barth, Web Freelancer from Berlin',
  description:
    'Articles about web development and design, HTML, CSS and JavaScript, Single-Page-Applications with ReactJS and without, performance and best practices.',
  alternates: {
    types: {
      'application/rss+xml': '/blog/feed/rss.xml',
    },
  },
}

export default async function BlogIndex() {
  const posts = await getPosts()
  return (
    <MainContent lang="en">
      <h2 className="text-3xl font-bold mb-7">
        Articles by Tobias Barth, Web Freelancer from Berlin
      </h2>
      <p className="mb-7 text-center">
        <Link
          href="/blog/feed/rss.xml"
          className="rounded py-2 px-4 shadow-sm bg-primary text-gray-200 font-bold inline-flex items-center"
        >
          Abonnieren{' '}
          <span className="inline-block w-6 h-6 ml-4">
            <RssIcon />
          </span>
        </Link>
      </p>
      <ul>
        {posts.map(({ frontmatter }) => (
          <li key={frontmatter.href} {...{ lang: frontmatter.lang }}>
            <div className="mb-7">
              <h3 className="text-2xl font-bold mb-4">
                <Link href={frontmatter.href}>{frontmatter.title}</Link>
              </h3>
              {frontmatter.description && <p>{frontmatter.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </MainContent>
  )
}

const getPosts = async () => {
  const posts = await fs
    .readdir(path.resolve(process.cwd(), 'src/posts'))
    .then(paths =>
      Promise.all(
        paths
          .filter(filename => filename.endsWith('.md'))
          .map(async filePath => {
            const parsed = await fs
              .readFile(
                path.resolve(process.cwd(), 'src/posts/', filePath),
                'utf8'
              )
              .then(matter)
              .then(extractGrayMatter)
            parsed.frontmatter.href = `/blog/${path.basename(filePath, '.md')}`
            return parsed
          })
      )
    )
  posts.sort((a, b) =>
    new Date(a.frontmatter.date).getTime() <
    new Date(b.frontmatter.date).getTime()
      ? 1
      : -1
  )
  return posts
}

const extractGrayMatter = (data: GrayMatterFile<string>) => {
  return {
    frontmatter: data.data as BlogFrontmatter,
  }
}
type BlogFrontmatter = GrayMatterFile<string>['data'] & {
  title?: string
}

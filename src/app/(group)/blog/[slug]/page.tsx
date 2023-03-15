import { promises as fs } from 'fs'
import path from 'path'
import matter, { GrayMatterFile } from 'gray-matter'
import BlogArticle from '../BlogArticle'
import MainContent from '../../../../components/MainContent'

// Show 404s when a non-prerendered page is requested.
export const dynamicParams = false

type Params = {
  slug: string
}

// Find all posts and generate the slugs.
export const generateStaticParams = async (): Promise<Array<Params>> => {
  return fs.readdir(path.resolve(process.cwd(), 'src/posts')).then(paths =>
    paths
      .filter(filename => filename.endsWith('.md'))
      .map(filename => ({
        slug: path.basename(filename, '.md'),
      }))
  )
}

// Use async post data to generate the head data.
export const generateMetadata = ({ params }: { params: Params }) =>
  getPostData(params).then(data => ({
    title: (data && data.frontmatter.title) || '',
    description: (data && data.frontmatter.description) || '',
    alternates: {
      types: {
        'application/rss+xml': '/blog/feed/rss.xml',
      },
    },
  }))

const getPostData = ({ slug }: Params) =>
  import(`../../../../posts/${slug}.md`)
    .then(({ default: content }) => content)
    .then(matter)
    .then(extractGrayMatter)

type BlogFrontmatter = GrayMatterFile<string>['data'] & {
  title?: string
  description?: string
}

const extractGrayMatter = (data: GrayMatterFile<string>) => {
  return {
    frontmatter: data.data as BlogFrontmatter,
    markdownBody: data.content,
  }
}

interface BlogTemplateProps {
  params?: { slug: string }
}

export default async function BlogTemplate({ params }: BlogTemplateProps) {
  if (!params) return null
  const { frontmatter, markdownBody } = await getPostData(params)
  return frontmatter && markdownBody ? (
    <MainContent lang="en">
      <BlogArticle frontmatter={frontmatter} markdownBody={markdownBody} />
    </MainContent>
  ) : null
}

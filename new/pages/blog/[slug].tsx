import * as React from 'react'
import matter, {GrayMatterFile} from 'gray-matter'
import ReactMarkdown from 'react-markdown/with-html'
import Highlight from '../../components/Highlight'

type BlogFrontmatter = GrayMatterFile<string>['data'] & {
	title?: string
}

interface BlogTemplateProps {
	error?: string
	frontmatter?: BlogFrontmatter
	markdownBody?: GrayMatterFile<string>['content']
}

const formatDate = (date: Date) => {
	return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

const BlogTemplate: React.FC<BlogTemplateProps> = ({error, frontmatter, markdownBody}) => (
	!error && frontmatter && markdownBody ?
		(
			<div className="blog-textcontainer">
				<article>
					<header>
						<h2>{frontmatter.title}</h2>
						{frontmatter.date && (<p className="date">Geschrieben am <time dateTime={new Date(frontmatter.date).toISOString()}>{formatDate(new Date(frontmatter.date))}</time></p>)}
					</header>
					<div className="blog-post-content">
						<ReactMarkdown source={markdownBody} escapeHtml={false} renderers={{code: Highlight}} />
					</div>
				</article>
			</div>
		)
		: null
)

const extractGrayMatter = (data: GrayMatterFile<string>) => {
	return {
		frontmatter: data.data as BlogFrontmatter,
		markdownBody: data.content
	}
}

const wrapInProps = (data: any) => ({props: data})

export const getStaticProps = ({params: {slug}}) =>
	import(`../../posts/${slug}.md`)
		.then(({default: content}) => content)
		.then(matter)
		.then(extractGrayMatter)
		.then(wrapInProps)
		.catch(() => {
			return {
				props: {
					error: 'Post does not exist'
				}
			}
		})

export const getStaticPaths = () => ({
	paths: [],
	fallback: true
})

export default BlogTemplate

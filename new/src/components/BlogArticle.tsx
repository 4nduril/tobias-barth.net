import React, {FC} from 'react'
import {GrayMatterFile} from 'gray-matter'
import ReactMarkdown from 'react-markdown/with-html'
import Highlight from '../../src/components/Highlight'

type BlogFrontmatter = GrayMatterFile<string>['data'] & {
	title?: string
}

interface BlogArticleProps {
	frontmatter?: BlogFrontmatter
	markdownBody?: GrayMatterFile<string>['content']
}

const formatDate = (date: Date) => {
	return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

const BlogArticle: FC<BlogArticleProps> = ({frontmatter, markdownBody}) => (
	!frontmatter || !markdownBody ? null : (
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

	))

export default BlogArticle

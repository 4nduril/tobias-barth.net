import { GrayMatterFile } from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypePrism from '@mapbox/rehype-prism'
import { FC } from 'react'
import styles from './BlogArticle.module.css'

type BlogFrontmatter = GrayMatterFile<string>['data'] & {
  title?: string
}

interface BlogArticleProps {
  frontmatter?: BlogFrontmatter
  markdownBody?: GrayMatterFile<string>['content']
}

const formatDate = (date: Date, lang?: string) => {
  const englishMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ] as const

  return lang === 'de'
    ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    : `${
        englishMonths[date.getMonth()]
      }, ${date.getDate()}th ${date.getFullYear()}`
}

const BlogArticle: FC<BlogArticleProps> = ({ frontmatter, markdownBody }) => {
  return !frontmatter || !markdownBody ? null : (
    <article className="overflow-hidden">
      <header>
        <h2 className="text-3xl font-bold mt-4 mb-7">{frontmatter.title}</h2>
        {frontmatter.date && (
          <p className="text-base text-center mb-7">
            {frontmatter.lang === 'de' ? (
              <>
                Geschrieben am{' '}
                <time dateTime={new Date(frontmatter.date).toISOString()}>
                  {formatDate(new Date(frontmatter.date), frontmatter.lang)}
                </time>
              </>
            ) : (
              <>
                Written on{' '}
                <time dateTime={new Date(frontmatter.date).toISOString()}>
                  {formatDate(new Date(frontmatter.date), frontmatter.lang)}
                </time>
              </>
            )}
          </p>
        )}
      </header>
      <div className={styles['blog-post-content']}>
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypePrism]}>
          {markdownBody}
        </ReactMarkdown>
      </div>
    </article>
  )
}

export default BlogArticle

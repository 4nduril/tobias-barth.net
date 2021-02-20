import React, { FC, useContext } from "react";
import { GrayMatterFile } from "gray-matter";
import ReactMarkdown from "react-markdown/with-html";
import Highlight from "../../src/components/Highlight";
import { ThemeContext } from "../utils/theme";

type BlogFrontmatter = GrayMatterFile<string>["data"] & {
  title?: string;
};

interface BlogArticleProps {
  frontmatter?: BlogFrontmatter;
  markdownBody?: GrayMatterFile<string>["content"];
}

const formatDate = (date: Date) => {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

const BlogArticle: FC<BlogArticleProps> = ({ frontmatter, markdownBody }) => {
  const theme = useContext(ThemeContext);
  return !frontmatter || !markdownBody ? null : (
    <article>
      <header>
        <h2>{frontmatter.title}</h2>
        {frontmatter.date && (
          <p className="date">
            Geschrieben am{" "}
            <time dateTime={new Date(frontmatter.date).toISOString()}>
              {formatDate(new Date(frontmatter.date))}
            </time>
          </p>
        )}
      </header>
      <div className="blog-post-content">
        <ReactMarkdown
          source={markdownBody}
          escapeHtml={false}
          renderers={{ code: Highlight }}
        />
      </div>
      <style jsx>{`
        article {
          overflow: hidden;
        }
        header {
          margin-top: 1em;
        }
        h2 {
          padding: 0 0.2em;
        }
        .date {
          font-size: ${theme.sizes.milli};
          line-height: ${theme.sizes.milliline};
          text-align: center;
        }
      `}</style>
    </article>
  );
};

export default BlogArticle;

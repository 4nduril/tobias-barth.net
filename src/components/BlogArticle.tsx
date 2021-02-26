import { GrayMatterFile } from "gray-matter";
import ReactMarkdown from "react-markdown/with-html";
import Highlight from "../../src/components/Highlight";
import { FC } from "react";
import styles from "./BlogArticle.module.css";

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
  return !frontmatter || !markdownBody ? null : (
    <article className="overflow-hidden">
      <header>
        <h2 className="text-3xl font-bold mt-4 mb-7">{frontmatter.title}</h2>
        {frontmatter.date && (
          <p className="text-base text-center">
            Geschrieben am{" "}
            <time dateTime={new Date(frontmatter.date).toISOString()}>
              {formatDate(new Date(frontmatter.date))}
            </time>
          </p>
        )}
      </header>
      <div className={styles["blog-post-content"]}>
        <ReactMarkdown
          source={markdownBody}
          escapeHtml={false}
          renderers={{ code: Highlight }}
        />
      </div>
    </article>
  );
};

export default BlogArticle;

import { promises as fs } from "fs";
import path from "path";
import React, { useContext } from "react";
import matter, { GrayMatterFile } from "gray-matter";
import ErrorPage from "next/error";
import SiteHead from "../../components/SiteHead";
import BlogArticle from "../../components/BlogArticle";
import MainContent from "../../components/MainContent";
import MainNavigation from "../../components/MainNavigation";
import { ThemeContext } from "../../utils/theme";
import SiteFooter from "../../components/SiteFooter";

type BlogFrontmatter = GrayMatterFile<string>["data"] & {
  title?: string;
};

interface BlogTemplateProps {
  error?: string;
  frontmatter?: BlogFrontmatter;
  markdownBody?: GrayMatterFile<string>["content"];
}

const BlogTemplate: React.FC<BlogTemplateProps> = ({
  error,
  frontmatter,
  markdownBody,
}) => {
  const theme = useContext(ThemeContext);
  if (error) {
    console.log(error);
    return <ErrorPage statusCode={404} />;
  }
  return frontmatter && markdownBody ? (
    <>
      <SiteHead />
      <MainNavigation />
      <MainContent>
        <div className="blog-textcontainer">
          <BlogArticle frontmatter={frontmatter} markdownBody={markdownBody} />
        </div>
      </MainContent>
      <SiteFooter />
      <style jsx>{`
		.blog-textcontainer {
			margin-left: auto;
			margin-right: auto;
			max-width: 33em;
			padding: 0 ${theme.spacing.gutWidth};
		`}</style>
    </>
  ) : null;
};

const extractGrayMatter = (data: GrayMatterFile<string>) => {
  return {
    frontmatter: data.data as BlogFrontmatter,
    markdownBody: data.content,
  };
};

const wrapInProps = (data: any) => ({ props: data });

export const getStaticProps = ({ params: { slug } }) =>
  import(`../../posts/${slug}.md`)
    .then(({ default: content }) => content)
    .then(matter)
    .then(extractGrayMatter)
    .then(wrapInProps)
    .catch((reason) => {
      return {
        props: {
          error: "Post does not exist: " + JSON.stringify(reason),
        },
      };
    });

export const getStaticPaths = async () => {
  const paths = await fs
    .readdir(path.resolve(process.cwd(), "src/posts"))
    .then((paths) =>
      paths
        .filter((filename) => filename.endsWith(".md"))
        .map((filename) => ({
          params: { slug: path.basename(filename, ".md") },
        }))
    );
  return {
    paths: paths,
    fallback: false,
  };
};

export default BlogTemplate;

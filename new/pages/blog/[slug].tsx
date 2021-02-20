import React, { useContext } from "react";
import matter, { GrayMatterFile } from "gray-matter";
import ErrorPage from "next/error";
import SiteHead from "../../src/components/SiteHead";
import BlogArticle from "../../src/components/BlogArticle";
import MainContent from "../../src/components/MainContent";
import MainNavigation from "../../src/components/MainNavigation";
import { ThemeContext } from "../../src/utils/theme";
import SiteFooter from "../../src/components/SiteFooter";

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

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});

export default BlogTemplate;

import { promises as fs } from "fs";
import path from "path";
import matter, { GrayMatterFile } from "gray-matter";
import ErrorPage from "next/error";
import Head from "next/head";
import BlogArticle from "../../components/BlogArticle";
import { Layout } from "../../components/Layout";

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
  if (error) {
    console.log(error);
    return <ErrorPage statusCode={404} />;
  }
  return frontmatter && markdownBody ? (
    <Layout>
      <Head>
        <title>
          {frontmatter.title} – Blog-Articles by Tobias Barth, Web Freelancer
          from Berlin
        </title>
        <meta
          name="description"
          content={frontmatter.description || frontmatter.title}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/blog/feed/rss.xml"
        />
      </Head>
      <BlogArticle frontmatter={frontmatter} markdownBody={markdownBody} />
    </Layout>
  ) : null;
};

const extractGrayMatter = (data: GrayMatterFile<string>) => {
  return {
    frontmatter: data.data as BlogFrontmatter,
    markdownBody: data.content,
  };
};

const wrapInProps = (data: any) => ({ props: data });

export const getStaticProps = async ({ params: { slug }, preview }) => {
  const postData = await import(`../../posts/${slug}.md`)
    .then(({ default: content }) => content)
    .catch(() => false);
  if (postData) {
    return wrapInProps(extractGrayMatter(matter(postData)));
  }
  if (!preview) {
    return {
      props: {
        error: "Post does not exist.",
      },
    };
  }
  const draftData = await import(`../../drafts/${slug}.md`)
    .then(({ default: content }) => content)
    .catch(() => false);
  if (draftData) {
    return wrapInProps(extractGrayMatter(matter(draftData)));
  }
  return {
    props: {
      error: "Post does not exist.",
    },
  };
};

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

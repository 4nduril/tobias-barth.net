import { promises as fs } from "fs";
import path from "path";
import { FunctionComponent } from "react";
import matter, { GrayMatterFile } from "gray-matter";
import Link from "next/link";
import { Layout } from "../../components/Layout";
import Head from "next/head";

type BlogProps = {
  posts: {
    frontmatter: GrayMatterFile<string>["data"];
  }[];
};

const Blog: FunctionComponent<BlogProps> = ({ posts }) => {
  return (
    <Layout>
      <Head>
        <title>Blog-Articles by Tobias Barth, Freelance Web Person</title>
        <meta
          name="description"
          content="Articles about web development and design, HTML, CSS and JavaScript, Single-Page-Applications with ReactJS and without, performance and best practices."
        />
        <meta
          name="keywords"
          content={[
            ...new Set(
              posts
                .flatMap(({ frontmatter }) => frontmatter.tags)
                .filter(Boolean)
            ),
          ].join(", ")}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/blog/feed/rss.xml"
        />
      </Head>
      <h2 className="text-3xl font-bold mb-7">
        Blog-Articles by Tobias Barth, Freelance Web Person
      </h2>
      <p>
        <a href="/blog/feed/rss.xml">Abonnieren</a>
      </p>
      <ul>
        {posts.map(({ frontmatter }) => (
          <li key={frontmatter.href}>
            <Link href={frontmatter.href}>
              <div className="mb-7">
                <h3 className="text-2xl font-bold mb-4">
                  <a>{frontmatter.title}</a>
                </h3>
                {frontmatter.description && <p>{frontmatter.description}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Blog;

export const getStaticProps = async () => {
  const posts = await fs
    .readdir(path.resolve(process.cwd(), "src/posts"))
    .then((paths) =>
      Promise.all(
        paths
          .filter((filename) => filename.endsWith(".md"))
          .map(async (filePath) => {
            const parsed = await fs
              .readFile(
                path.resolve(process.cwd(), "src/posts/", filePath),
                "utf8"
              )
              .then(matter)
              .then(extractGrayMatter);
            parsed.frontmatter.href = `/blog/${path.basename(filePath, ".md")}`;
            return parsed;
          })
      )
    );
  posts.sort((a, b) =>
    new Date(a.frontmatter.date).getTime() <
    new Date(b.frontmatter.date).getTime()
      ? 1
      : -1
  );
  return {
    props: {
      posts,
    },
  };
};
const extractGrayMatter = (data: GrayMatterFile<string>) => {
  return {
    frontmatter: data.data as BlogFrontmatter,
  };
};
type BlogFrontmatter = GrayMatterFile<string>["data"] & {
  title?: string;
};

import { promises as fs } from "fs";
import path from "path";
import { FunctionComponent, useContext } from "react";
import matter, { GrayMatterFile } from "gray-matter";
import SiteHead from "../../components/SiteHead";
import MainContent from "../../components/MainContent";
import MainNavigation from "../../components/MainNavigation";
import { ThemeContext } from "../../utils/theme";
import SiteFooter from "../../components/SiteFooter";
import Link from "next/link";

type BlogProps = {
  posts: {
    frontmatter: GrayMatterFile<string>["data"];
  }[];
};

const Blog: FunctionComponent<BlogProps> = ({ posts }) => {
  const theme = useContext(ThemeContext);
  return (
    <>
      <SiteHead />
      <MainNavigation />
      <MainContent>
        <div className="blog-textcontainer">
          <h2>Blog-Articles by Tobias Barth, Freelance Web Person</h2>
          <ul>
            {posts.map(({ frontmatter }) => (
              <li>
                <Link href={frontmatter.href}>
                  <>
                    <a>{frontmatter.title}</a>
                    {frontmatter.description && (
                      <p>{frontmatter.description}</p>
                    )}
                  </>
                </Link>
              </li>
            ))}
          </ul>
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
  );
};

export default Blog;

export const getStaticProps = async () => {
  const posts = await fs
    .readdir(path.resolve(process.cwd(), "src/posts"))
    .then((paths) =>
      Promise.all(
        paths.map(async (filePath) => {
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
  console.log(posts);
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

/*
 * const unifiedModule = import('unified')
 * const remarkParseModule = import('remark-parse')
 * const remarkRehypeModule = import('remark-rehype')
 * const rehypePrismModule = import('@mapbox/rehype-prism')
 */

module.exports = {
  content: {
    files: ['./src/**/*.{js,ts,jsx,tsx,md}'],
    /*
     * transform: {
     *   md: content => {
     *     return Promise.all([
     *       unifiedModule,
     *       remarkParseModule,
     *       remarkRehypeModule,
     *       rehypePrismModule,
     *     ]).then(([{ unified }, remarkParse, remarkRehype, rehypePrism]) =>
     *       unified()
     *         .use(remarkParse)
     *         .use(remarkRehype)
     *         .use(rehypePrism)
     *         .process(content)
     *         .then(x => console.log(x) || x)
     *     )
     *   },
     * },
     */
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

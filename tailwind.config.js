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
  theme: {
    fontFamily: {
      display: ['Dosis', 'sans-serif'],
      body: ['"PT Sans"', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#0B65AA',
        'link-color': '#074574',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

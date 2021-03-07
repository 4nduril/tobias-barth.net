import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="de">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Dosis:wght@300;400&family=PT+Sans:ital,wght@0,400;0,700;1,400&display=swap"
            rel="stylesheet"
          />
          <script
            async
            defer
            data-domain="tobias-barth.net"
            src="https://stats.tobias-barth.net/js/index.js"
          ></script>
        </Head>
        <body className="text-lg lg:text-xl leading-snug font-body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

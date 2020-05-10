import React, {FC} from 'react'
import {AppProps} from 'next/app'
import 'normalize.css'
import {ThemeProvider, theme} from '../src/utils/theme'

const App: FC<AppProps> = ({Component, pageProps}) => (
	<ThemeProvider value={theme}>
		<Component {...pageProps} />
		<style global jsx>{`
			@font-face {
				font-family: 'PT Sans';
				src: local('PT Sans Italic'), local('PTSans-Italic'),
					url('/fonts/subset-PTSans-Italic.woff2') format('woff2'),
					url('/fonts/subset-PTSans-Italic.woff') format('woff'),
					url('/fonts/subset-PTSans-Italic.ttf') format('truetype');
				font-weight: normal;
				font-style: italic;
			}

			@font-face {
				font-family: 'PT Sans';
				src: local('PT Sans'), local('PTSans-Regular'),
					url('/fonts/subset-PTSans-Regular.woff2') format('woff2'),
					url('/fonts/subset-PTSans-Regular.woff') format('woff'),
					url('/fonts/subset-PTSans-Regular.ttf') format('truetype');
				font-weight: normal;
				font-style: normal;
			}

			@font-face {
				font-family: 'PT Sans';
				src: local('PT Sans Bold'), local('PTSans-Bold'),
					url('/fonts/subset-PTSans-Bold.woff2') format('woff2'),
					url('/fonts/subset-PTSans-Bold.woff') format('woff'),
					url('/fonts/subset-PTSans-Bold.ttf') format('truetype');
				font-weight: bold;
				font-style: normal;
			}

			@font-face {
				font-family: 'Dosis';
				src: local('Dosis Light'), local('Dosis-Light'),
					url('/fonts/subset-Dosis-Light.woff2') format('woff2'),
					url('/fonts/subset-Dosis-Light.woff') format('woff'),
					url('/fonts/subset-Dosis-Light.ttf') format('truetype');
				font-weight: 300;
				font-style: normal;
			}
			* {
				margin: 0;
				box-sizing: border-box;
			}
			body {
				font-size: ${theme.sizes.fontsize};
				line-height: ${theme.sizes.lineheight};
				font-family: ${theme.fonts.fontfamily};
			}
			@media screen and (min-width: 65em) {
				body {
					font-size: ${theme.sizes.mFontsize};
					line-height: ${theme.sizes.mLineheight};
				}
			}
			p,ul,ol,dl,aside,section,article,h1,h3,h4,h5,h6,address,hr,main,table,iframe,header,pre,figure {
				${theme.spacing.vertical('margin-bottom')};
			}
			@media screen and (min-width: 65em) {
				p,ul,ol,dl,aside,section,article,h1,h3,h4,h5,h6,address,hr,main,table,iframe,header,pre,figure {
					${theme.spacing.vertical('margin-bottom')};
				}
			}
			a:focus {
				outline: thin dotted;
			}
			a {
				color: ${theme.colors.linkcolor};
				text-decoration: none;
				transition: all .5s ease-in;
			}
			a:hover, a:focus {
				color: ${theme.colors.bgcolor};
				background-color: ${theme.colors.linkcolor};
			}
			q {
				quotes:"„" "“" "‚" "‘";
			}

			blockquote {
				font-style:italic;
				padding:0 1em;
				border-left:3px solid #ddd;
			}
			img {
				max-width:100%;
			}
			abbr,acronym {
				cursor:help;
			}
			figure {
				box-shadow: 0 2px 4px rgba(0,0,0,.5);
				border-radius: 2px;
			}

			ol, ul {
				list-style-position:inside;
			}
			dt {
				font-style:italic;
			}
			dd {
				padding-left:2em;
				${theme.spacing.vertical('margin-bottom')}
			}
		`}
		</style>
	</ThemeProvider>
)

export default App

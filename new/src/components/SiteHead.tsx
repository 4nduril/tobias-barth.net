import React, {FC, useContext} from 'react'
import Link from 'next/link'
import {ThemeContext} from '../utils/theme'

const SiteHead: FC = () => {
	const theme = useContext(ThemeContext)
	return (
		<header>
			<Link href="/">
				<a>
					<h1>tobias-barth.net</h1>
					<p>Modernes Web aus Köln</p>
				</a>
			</Link>
			<style jsx>{`
				header {
					background: ${theme.colors.maincolor};
					color: ${theme.colors.lighttextcolor};
					display: flex;
					justify-content: flex-end;
				}
				a {
					color: inherit;
					text-decoration: none;
					padding: 0 ${theme.spacing.gutWidth};
				}
				h1, p {
					font-family: ${theme.fonts.logofont};
					text-align: right;
					text-shadow: 0 1px 2px rgba(34, 34, 34, 0.9);
				}
				h1 {
					${theme.spacing.vertical('margin-top')}
					font-size: ${theme.sizes.mega};
					line-height: ${theme.sizes.megaline};
					margin-bottom: 0;
				}
				p {
					font-size: ${theme.sizes.h2};
					line-height: ${theme.sizes.h2line};
					letter-spacing:.015em;
				}
				@media screen and (min-width: 65em) {
					h1 {
						${theme.spacing.bigVertical('margin-top')}
					}
				}
			`}
			</style>
		</header>
	)
}

export default SiteHead

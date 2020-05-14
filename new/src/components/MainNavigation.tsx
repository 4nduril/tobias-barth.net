import React, {FC, useContext} from 'react'
import Link from 'next/link'
import {ThemeContext} from '../utils/theme'

const MainNavigation: FC = () => {
	const theme = useContext(ThemeContext)
	return (
		<nav>
			<ul>
				<li><Link href="/portfolio"><a title="Meine Fähigkeiten, Arbeitsfelder und Beispielprojekte">Ich mache</a></Link></li>
				<li><Link href="/blog"><a title="Mein Blog über Webentwicklung und Ähnliches">Ich schreibe</a></Link></li>
			</ul>
			<style jsx>{`
		nav {
			${theme.spacing.vertical('margin-top', -1)}
			${theme.spacing.vertical('margin-bottom')}
			font-weight: bold;
			background-color: ${theme.colors.maincolor};
			overflow: hidden;
		}
		@media screen and (min-width: 65em) {
			nav {
				${theme.spacing.bigVertical('margin-top', -1)}
				${theme.spacing.bigVertical('margin-bottom')}
			}

		}
		ul {
			display: flex;
			justify-content: space-around;
			list-style: none;
			margin: 0;
			padding: 0;
		}
		li {
			flex: 1;
			margin: 0 ${theme.spacing.gutWidth};
			text-align: center;
		}
		a {
			text-decoration: none;
			color: ${theme.colors.lighttextcolor};
			display: inline-block;
			padding: .5em .2em;
			width: auto;
			height: 100%;
		}
		a:focus, a:active {
			outline: none;
				color: ${theme.colors.bgcolor};
				background-color: ${theme.colors.linkcolor};
		}
		`}</style>
		</nav>
	)
}

export default MainNavigation

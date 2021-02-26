import {createContext} from 'react'

const fontsizevalue = 1.125
const multiplier = 1.111
const lineheight = 1.4444
const vertical = fontsizevalue * lineheight

export const theme = {
	sizes: {
		fontsize: `${fontsizevalue}rem`,
		lineheight: `${lineheight}`,
		mFontsize: `${fontsizevalue * multiplier}rem`,
		h1: `${fontsizevalue * 2}rem`,
		h1Big: `${fontsizevalue * 2 * multiplier}rem`,
		h1line: `${lineheight}`,
		h2: `${fontsizevalue * lineheight}rem`,
		h2Big: `${fontsizevalue * lineheight * multiplier}rem`,
		h2line: `${1}`,
		h3: `${fontsizevalue * 1.2}rem`,
		h3Big: `${fontsizevalue * 1.2 * multiplier}rem`,
		h3line: `${lineheight / 1.2}`,
		h4: `${fontsizevalue * 1.1}rem`,
		h4Big: `${fontsizevalue * 1.1 * multiplier}rem`,
		h4line: `${lineheight / 1.1}`,
		h5: `${fontsizevalue}rem`,
		h5Big: `${fontsizevalue * multiplier}rem`,
		h5line: `${lineheight}`,
		h6: `${fontsizevalue}rem`,
		h6Big: `${fontsizevalue * multiplier}rem`,
		h6line: `${lineheight}`,
		mega: `${fontsizevalue * 2.5}rem`,
		megaBig: `${fontsizevalue * 2.5 * multiplier}rem`,
		megaline: `${lineheight / 1.25}`,
		milli: `${fontsizevalue * 0.8125}rem;`,
		milliBig: `${fontsizevalue * 0.8125 * multiplier}rem`,
		milliline: `${lineheight / 0.8125}`,
	},
	colors: {
		maincolor: '#0B65AA',
		bgcolor: '#fff',
		lighttextcolor: '#eee',
		linkcolor: '#074574',
	},
	fonts: {
		fontfamily: "'PT Sans', 'Liberation Sans', Helvetica, Arial, sans-serif",
		logofont: "Dosis, Helvetica, Arial, sans-serif",
	},
	spacing: {
		vertical(prop: string, multi = 1) {
			return `
			${prop}: ${vertical * multi}rem;
			`
		},
		bigVertical(prop: string, multi = 1) {
			return `
				${prop}: ${vertical * multiplier * multi}rem;
			`
		},
		gutWidth: '1.6666%',
	}
}

export const ThemeContext = createContext<Partial<typeof theme>>({})

export const ThemeProvider = ThemeContext.Provider

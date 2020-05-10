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
		mLineheight: `${lineheight * multiplier}`,
		mega: `${fontsizevalue * 2.5}rem`,
		megaline: `${lineheight / 1.25}`,
		h2: `${fontsizevalue * lineheight}rem`,
		h2line: '1',
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

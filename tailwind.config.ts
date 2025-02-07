import type { Config } from "tailwindcss";

export default {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				satoshi: ["Satoshi", "sans-serif"],
				inter: ["Inter", "sans-serif"],
			},
			colors: {
				"primary-orange": "#FF5722",
				"dark-bg": "#121212",
				"dark-surface": "#1E1E1E",
			},
		},
	},
	plugins: [],
} satisfies Config;

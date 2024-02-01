const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: "#EF4343",
				background: {
					DEFAULT: "rgb(244 244 245 / 1)",
					dark: "rgb(24 24 27 / 1);",
				},
			},
		},
	},
	plugins: [
		iconsPlugin({
			collections: getIconCollections(["lucide"]),
		}),
	],
};

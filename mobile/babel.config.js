module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],

		plugins: [
			"react-native-reanimated/plugin",
			[
				"module-resolver",
				{
					extensions: [".js", ".jsx", ".ts", ".tsx", ".android.js", ".android.tsx", ".ios.js", ".ios.tsx"],
					root: ["src"],
					alias: {
						"@sidekyk": "./src",
						"@components": "./src/components",
						"@lib": "./src/lib",
						"@stores": "./src/stores",
						"@theme": "./src/theme",
						"@hooks": "./src/hooks",
					},
				},
			],
		],
		env: {
			production: {
				plugins: ["transform-remove-console"],
			},
		},
	};
};

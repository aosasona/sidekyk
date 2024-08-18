const IS_IN_DEVELOPMENT = process.env.APP_ENVIRONMENT === "development";
const IS_IN_PREVIEW = process.env.APP_ENVIRONMENT === "preview";

const config = {
	name: IS_IN_DEVELOPMENT ? "Sidekyk Dev" : IS_IN_PREVIEW ? "Sidekyk Preview" : "Sidekyk",
	slug: "sidekyk",
	owner: "realao",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/" + (IS_IN_DEVELOPMENT ? "icon-dev.png" : "icon.png"),
	userInterfaceStyle: "automatic",
	jsEngine: "hermes",
	privacy: "hidden",
	scheme: "sidekyk",
	splash: {
		image: "./assets/splash.png",
		resizeMode: "contain",
		backgroundColor: "#EF4343",
	},
	updates: {
		fallbackToCacheTimeout: 0,
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		associatedDomains: ["applinks:sidekyk.app", "applinks:www.sidekyk.app"],
		usesAppleSignIn: false,
		supportsTablet: false,
		bundleIdentifier: IS_IN_DEVELOPMENT ? "com.wytehq.sidekyk.dev" : IS_IN_PREVIEW ? "com.wytehq.sidekyk.preview" : "com.wytehq.sidekyk",
		config: {
			usesNonExemptEncryption: false,
		},
		infoPlist: {
			NSPhotoLibraryUsageDescription: "Allow Sidekyk to access your photos so you can use them in your chats.",
			MinimumOSVersion: "15.0",
		},
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/" + (IS_IN_DEVELOPMENT ? "icon-dev.png" : "adaptive-icon.png"),
			backgroundColor: "#EF4343",
		},
		package: IS_IN_DEVELOPMENT ? "com.wytehq.sidekyk.dev" : IS_IN_PREVIEW ? "com.wytehq.sidekyk.preview" : "com.wytehq.sidekyk",
	},
	notification: {
		icon: "./assets/96x96.png",
		color: "#FFFFFF",
	},
	extra: {
		eas: {
			projectId: "cf9d8016-695e-42b5-85f7-8a9a5e4d8204",
		},
	},
	updates: {
		url: "https://u.expo.dev/cf9d8016-695e-42b5-85f7-8a9a5e4d8204",
	},
	runtimeVersion: {
		policy: "sdkVersion",
	},
	hooks: {
		postPublish: [
			{
				file: "sentry-expo/upload-sourcemaps",
				config: {
					organization: "wytespace",
					project: "react-native",
				},
			},
		],
	},
	plugins: [
		"sentry-expo",
		["expo-notifications"],
		[
			"expo-local-authentication",
			{
				faceIDPermission: "Allow Sidekyk to use Face ID.",
			},
		],
		[
			"expo-updates",
			{
				username: "realao",
			},
		],
		"@config-plugins/react-native-blob-util",
		[
			"@react-native-voice/voice",
			{
				microphonePermission: "Allow Sidekyk to access the microphone",
				speechRecognitionPermission: "Allow Sidekyk to securely recognize user speech",
			},
		],
		[
			"expo-av",
			{
				microphonePermission: "Allow Sidekyk to access your microphone.",
			},
		],
	],
};

export default config;

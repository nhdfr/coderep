import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	// disable the experimental React Compiler to avoid requiring
	// `babel-plugin-react-compiler` during local development.
	experimental: {
		reactCompiler: false,
	},
	// Enable standalone output for Docker deployment
	output: "standalone",
};

export default nextConfig;

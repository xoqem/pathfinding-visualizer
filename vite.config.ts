import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import biomePlugin from "vite-plugin-biome";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
	base: "./",
	plugins: [
		nodePolyfills(),
		react(),
		biomePlugin({
			mode: "check",
			files: ".",
			applyFixes: true,
		}),
	],
});

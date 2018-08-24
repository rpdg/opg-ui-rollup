import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";

export default {
	entry: "src/opg.ts",
	output: {
		file: "dist/opglib.js",
		name: "opglib",
		format: "iife",
		sourcemap: true
	},
	plugins: [
		commonjs(),
		typescript({
			tsconfig: "tsconfig.json",
			useTsconfigDeclarationDir: true
		})
	]
};

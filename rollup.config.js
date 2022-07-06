import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import pkg from './package.json';

export default {
    input: './src/index.ts',
    external: ['rough-notation', 'jquery'],
    output: {
        name: 'AutoNotate',
        file: pkg.browser,
        format: 'iife',
        globals: {
            jquery: "$",
            "rough-notation": "RoughNotation",
        }
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript(),
        optimizeLodashImports(),
    ]
};

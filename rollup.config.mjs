import typescript from '@rollup/plugin-typescript';
import clean from 'rollup-plugin-delete';
import url from '@rollup/plugin-url';
import eslint from '@rollup/plugin-eslint';
import terser from '@rollup/plugin-terser';

/*
 * Build Process (Rollup)
 *
 * Deployment process with Tree-Shaking and code optimization
 *
 * @private
 * @author Ádám Székely (https://www.linkedin.com/in/enteocode/)
 */

/**
 * Build process configurations
 *
 * @type import('rollup').RollupOptions
 */
const config = {
    input: './src/index.ts',
    output: [
        {
            file: './dist/index.mjs',
            format: 'es',
            sourcemapExcludeSources: true,
            sourcemap: true,
            validate: true
        },
        {
            file: './dist/index.js',
            format: 'cjs',
            sourcemapExcludeSources: true,
            sourcemap: true,
            validate: true
        },
    ],
    external: [
        /^node:/
    ],
    plugins: [
        clean({
            targets: ['dist/*'],
            runOnce: true
        }),
        eslint({
            throwOnError: true,
            exclude: ['wasm/*']
        }),
        url({
            publicPath: './dist/',
            include: ['wasm/*.wasm'],
        }),
        typescript({
            rootDir: 'src',
            outputToFilesystem: true,
            declaration: true,
            declarationDir: './dist/types',
        }),
        terser({
            keep_classnames: true,
            sourceMap: true,
            compress: {
                side_effects: false,
                passes: 3,
                evaluate: true
            }
        })
    ]
};

export default config;

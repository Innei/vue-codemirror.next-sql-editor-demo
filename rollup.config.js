//@ts-check
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import vuePlugin from 'rollup-plugin-vue'

const packageJson = require('./package.json')

const umdName = packageJson.name

const globals = {
  ...packageJson.devDependencies,
}
const isProduction = process.env.NODE_ENV === 'production'

const dir = 'build'

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  {
    input: 'src/index.ts',
    // ignore lib
    external: [
      'react',
      'react-dom',
      'lodash',
      'lodash-es',
      ...Object.keys(globals),
    ],

    output: [
      {
        file: dir + '/index.umd.js',
        format: 'umd',
        sourcemap: true,
        name: umdName,
      },
      {
        file: dir + '/index.umd.min.js',
        format: 'umd',
        sourcemap: true,
        name: umdName,
        plugins: [terser()],
      },
      {
        file: dir + '/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: dir + '/index.cjs.min.js',
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        file: dir + '/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: dir + '/index.esm.min.js',
        format: 'es',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs({ include: 'node_modules/**' }),
      typescript({ tsconfig: './src/tsconfig.json', declaration: false }),
      vuePlugin({}),

      postcss({
        // @ts-ignore
        config: {
          path: './postcss.config.js',
        },
        extensions: ['.css'],
        extract: true,
        minimize: isProduction,
        // modules: true,
      }), //@ts-ignore
      peerDepsExternal(),
    ],

    treeshake: true,
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'build/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]

export default config

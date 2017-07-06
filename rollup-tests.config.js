import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';
import resolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies).concat(
  'graphql/language',
  'assert',
  'fs',
  'path'
);

export default {
  entry: 'test/**/*-test.js',
  plugins: [
    babel({
      presets: [
        ['shopify/node', {modules: false}]
      ]
    }),
    commonJs({
      include: 'node_modules/**'
    }),
    resolve({
      preferBuiltins: true,
      browser: false
    }),
    multiEntry({exports: false})
  ],
  external,
  targets: [
    {
      dest: '.tmp/tests.js',
      format: 'cjs',
      sourceMap: true
    }
  ]
};

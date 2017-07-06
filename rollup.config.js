import babel from 'rollup-plugin-babel';
import {readFileSync} from 'fs';
import {execSync} from 'child_process';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies).concat('graphql/language');
const revision = execSync('git rev-parse HEAD').toString().trim().slice(0, 7);

const banner = `/*
${readFileSync('./LICENSE.md')}
Version: ${pkg.version} Commit: ${revision}
*/`;

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      presets: [
        ['shopify/node', {modules: false}]
      ]
    })
  ],
  external,
  banner,
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      sourceMap: true,
      moduleName: 'GraphQLToJSClientBuilder'
    }, {
      dest: pkg.module,
      format: 'es',
      sourceMap: true
    }
  ]
};

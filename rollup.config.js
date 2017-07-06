import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies).concat('graphql/language');

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      presets: [
        ['shopify/node', {modules: false}]
      ],
      plugins: [
        ['add-shopify-header', {files: ['src/index.js']}]
      ]
    })
  ],
  external,
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

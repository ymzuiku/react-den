module.exports = {
  lib: ['src/packages/react-den'], // need babel files or dirs
  dontLib: [], // dont babel files or dirs
  copy: {
    'src/packages/react-den': '../src',
    dist: '../lib',
    'dist/package.json': '../package.json',
  },
  delete: ['dist', '../lib/package.json'], // after copy builded, delete files
  package: {
    main: 'lib/index.js',
    types: 'src/index.d.ts',
    scripts: {
      lib: 'cd den-example && yarn lib',
      start: 'cd den-example && yarn start',
    },
    dependencies: {
      'graphql-request': '^1.8.2',
      immutable: '^4.0.0-rc.12',
      'pure-fn': '^0.0.2',
    },
  },
  gitURL: 'github.com/ymzuiku/react-den',
};

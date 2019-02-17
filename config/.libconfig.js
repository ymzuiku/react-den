module.exports = {
  lib: ['src/modules/react-den/index.js'], // need babel files or dirs
  dontLib: [], // dont babel files or dirs
  copy: [
    'README.md',
    'README-EN.md',
    'README-CN.md',
    ['src/modules/react-den/package.json', 'package.json'],
    ['src/modules/react-den/index.d.ts', 'index.d.ts'],
  ], // only copy files or dirs
  delete: [], // after copy builded, delete files
  gitURL: 'github.com/ymzuiku/react-den', // git URL, like: 'github.com/ymzuiku/react-project-gui'
};

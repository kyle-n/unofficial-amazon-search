const path = require('path');

module.exports = {
  entry: './dist/index.js',
  output: {
    filename: 'browser-bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: {
    'child_process': 'empty',
    'fs': 'empty',
    'net': 'empty',
    'tls': 'empty'
  },
  mode: 'production'
}

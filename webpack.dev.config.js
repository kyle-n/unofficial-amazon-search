const path = require('path');

module.exports = {
  entry: './dist/index.js',
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  node: {
    fs: 'empty',
    'child_process': 'empty',
    net: 'empty',
    tls: 'empty'
  },
  optimization: {
    minimize: false
  }
}
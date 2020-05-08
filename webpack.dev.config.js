const path = require('path');

module.exports = {
  entry: './dist/index.js',
  output: {
    filename: 'index.dev.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  optimization: {
    minimize: false
  }
}

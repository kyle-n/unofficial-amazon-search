const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'unofficial-amazon-search': './src/index.ts',
    'unofficial-amazon-search.min': './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, '_bundles'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'UnofficialAmazonSearch',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true,
      include: /\.min\.js$/
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  node: {
    'child_process': 'empty',
    'fs': 'empty',
    'net': 'empty',
    'tls': 'empty'
  },
  mode: 'development'
}

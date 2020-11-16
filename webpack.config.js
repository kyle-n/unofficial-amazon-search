const path = require('path');

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
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: '/node_modules/'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  mode: 'production',
  externals: {
    jsdom: 'jsdom'
  }
}

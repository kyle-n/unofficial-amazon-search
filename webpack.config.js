const path = require('path');

const sharedConfig = {
  output: {
    path: path.resolve(__dirname, '_bundles'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'UnofficialAmazonSearch',
    umdNamedDefine: true
  },
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
  externals: {
    jsdom: 'jsdom'
  }
};

const devConfig = {
  ...sharedConfig,
  entry: {
    'unofficial-amazon-search': './src/index.ts'
  },
  devtool: 'source-map',
  mode: 'development'
};

const prodConfig = {
  ...sharedConfig,
  entry: {
    'unofficial-amazon-search.min': './src/index.ts'
  },
  mode: 'production'
};

module.exports = [devConfig, prodConfig];

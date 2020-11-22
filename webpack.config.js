const path = require('path');

const sharedConfig = {
  output: {
    path: path.resolve(__dirname, '_bundles'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'UnofficialAmazonSearch',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.js']
  },
  externals: {
    jsdom: 'jsdom'
  }
};

const devConfig = {
  ...sharedConfig,
  entry: {
    'unofficial-amazon-search': './lib/index.js'
  },
  devtool: 'source-map',
  mode: 'development'
};

const prodConfig = {
  ...sharedConfig,
  entry: {
    'unofficial-amazon-search.min': './lib/index.js'
  },
  mode: 'production'
};

module.exports = [devConfig, prodConfig];

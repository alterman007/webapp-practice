const path = require('path');
const webpack = require('webpack');
const HTMLWepackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const config = {
  entry: {
    app: path.join(__dirname, '../client/index.js'),
  },
  output: {
    filename: '[name].[hash:5].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HTMLWepackPlugin({
      template: path.join(__dirname, '../index.html'),
      title: 'webpack',
    }),
  ],
};

if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/index.js'),
    ]
  };
  // 此处要确保文件夹中不存在dist目录
  // 否则webpack-dev-server会默认先检查dist目录中的内容
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    contentBase: path.join(__dirname, '../dist'),
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html',
    },
    hot: true,
    overlay: {
      errors: true,
    },
  };
  config.plugins = Array.isArray(config.plugins)
    ? config.plugins.concat(new webpack.HotModuleReplacementPlugin())
    : [new webpack.HotModuleReplacementPlugin()];
}

module.exports = config;

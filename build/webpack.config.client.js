const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HTMLWepackPlugin = require('html-webpack-plugin');

const baseConfig = require('./webpack.config.base');

const isDev = process.env.NODE_ENV === 'development';

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/index.js'),
  },
  output: {
    filename: '[name].[hash:5].js',
  },
  plugins: [
    new HTMLWepackPlugin({
      template: path.join(__dirname, '../index.html'),
      title: 'webpack',
    }),
  ],
});

if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/index.js'),
    ],
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

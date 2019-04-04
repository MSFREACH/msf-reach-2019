const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('./config');
const utils = require('./utils');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach((name) => {
  baseWebpackConfig.entry[name] = ['./app/build/dev-client'].concat(
    baseWebpackConfig.entry[name],
  );
});

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }),
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new HardSourceWebpackPlugin(),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index.html',
      inject: true,
    }),
    new FriendlyErrorsPlugin(),
    // generate favicons
    new FaviconsWebpackPlugin(path.resolve(__dirname, '../static/logo.png')),
  ],
});

const { resolve } = require('path');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const findBabelConfig = require('../utils/findBabelConfig');
const babelPreset = require('./babel-preset');
const config = require('./config');
// const log = require('../utils/log');

const isDev = process.env.NODE_ENV === 'development';
const webpackPlugins = [new CaseSensitivePathsPlugin()];

if (isDev) {
  webpackPlugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin(),
  );
}

function getBabelConfig(dir) {
  const babelConfig = {
    cacheDirectory: true,
    babelrc: false,
    presets: [],
  };

  const externalBabelConfig = findBabelConfig(dir);

  if (externalBabelConfig) {
    // log.info('Using custom babel configuration');
    babelConfig.babelrc = externalBabelConfig.options.babelrc !== false;
  }

  if (!babelConfig.babelrc) {
    babelConfig.presets.push(babelPreset);
  }

  return babelConfig;
}

let webpackConfig = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-source-map' : 'source-map',
  entry: config.scripts.entries,
  output: {
    path: resolve(config.output),
    publicPath: config.scripts.publicPath,
    filename: `${config.scripts.path}/[name].js`,
    chunkFilename: `${config.scripts.path}/chunks/[name].js`,
  },
  plugins: webpackPlugins,
  node: {
    fs: 'empty',
    process: false,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: getBabelConfig(config.dir),
      },
    ],
  },
};

if (typeof config.webpack === 'function') {
  webpackConfig = config.webpack(webpackConfig, isDev);
}

module.exports = webpackConfig;

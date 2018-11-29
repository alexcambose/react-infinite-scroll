const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const port = process.env.PORT || 8080;
const inDev = process.env.NODE_ENV !== 'production';
module.exports = {
  entry: {
    index: './src/index.js',
    vendor: ['react', 'react-dom', 'react-router', 'react-router-dom', 'redux', 'react-redux'],
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: `[${inDev ? 'name' : 'hash'}].bundle.js`,
  },
  mode: inDev ? 'development' : 'production',
  devtool: inDev ? 'cheap-source-map' : '',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: `fonts/[${inDev ? 'name' : 'hash'}].[ext]`,
        },
      },
    ],
  },
  plugins: [
    !inDev
      ? new UglifyJsPlugin({
        parallel: true,
        cache: true,
        uglifyOptions: {
          mangle: true,
          ie8: false,
        },
      })
      : false,
    new HtmlWebpackPlugin({
      templateContent: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>React Infinite Scroll</title>
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">

  </head>
  <body>
<script async defer src="https://buttons.github.io/buttons.js"></script></body>
</html>`,
    }),
    !inDev
      ? new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'static',
      })
      : false,
  ].filter(Boolean),
  optimization: {
    // minimize: false,
    runtimeChunk: {
      name: 'vendor',
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          minSize: 1,
        },
      },
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port,
  },
};

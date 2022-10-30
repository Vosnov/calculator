const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isProd = process.env.NODE_ENV === "production";

const config = {
  mode: isProd ? "production" : "development",
  entry: {
    app: path.join(__dirname, 'src', 'index.tsx')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    static: {
      directory: path.join(__dirname, 'build')
    },
    compress: true,
    port: 3000,
    hot: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      cache: true
    }),
    new MiniCssExtractPlugin({
      filename: !isProd ? "[name].css" : "[name].[contenthash].css",
      chunkFilename: !isProd ? "[id].css" : "[id].[contenthash].css",
    })
  ]
}

if (isProd) {
  config.optimization = {
    minimizer: [new TerserWebpackPlugin()],
  };
}

module.exports = config;
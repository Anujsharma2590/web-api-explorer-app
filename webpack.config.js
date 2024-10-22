const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const prod = process.env.NODE_ENV === 'production';

module.exports = {
  mode: prod ? 'production' : 'development', 
  entry: './src/index.tsx', 
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js', 
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, 
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.json'], 
        },
        use: 'ts-loader', 
      },
      {
        test: /\.css$/, 
        use: [MiniCssExtractPlugin.loader, 'css-loader'], 
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], 
  },
  devtool: prod ? false : 'source-map', 
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), 
    },
    historyApiFallback: true, 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', 
      filename: 'index.html', 
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', 
    }),
  ],
};

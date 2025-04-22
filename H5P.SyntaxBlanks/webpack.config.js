const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { plugins } = require('prismjs');
const nodeEnv = process.env.NODE_ENV || 'development';
const libraryName = process.env.npm_package_name;

module.exports = {
  mode: nodeEnv,
  context: path.resolve(__dirname, 'src'),
  entry: {
    lib:'./syntax-blanks.js'
  },
  devtool: nodeEnv === 'production' ? false : 'inline-source-map',
  output: {
    filename: `${libraryName}.js`,
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader',]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `css/${libraryName}.css`
    }),
  ],
  stats: {
    colors: true
  }
};

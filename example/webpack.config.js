const path = require('path');
const VersionFile = require('webpack-version-file');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  devServer: {
    inline: true,
    publicPath: '/build/',
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new VersionFile({
      output: './build/version.txt',
      package: './package.json'
    })
  ]
};

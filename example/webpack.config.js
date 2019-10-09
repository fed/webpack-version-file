const path = require('path');
const VersionFile = require('webpack-version-file');
// const VersionFile = require('../lib'); // Use this one instead for local testing

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new VersionFile({
      output: './dist/version.txt'
    })
  ]
};

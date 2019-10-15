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
    }),
    new VersionFile({
      output: './dist/rawr.js',
      templateString: 'export default {\n' +
        '  name: "<%= name %>",\n' +
        '  version: "<%= version %>",\n' +
        '  authorName: "<%= author[\'name\'] %>",\n' +
        '  authorEmail: "<%= author.email %>",\n' +
        '  firstKeyword: "<%= keywords[0] %>",\n' +
        '  year: <%= buildDate.getYear()+1900 %>,\n' +
        '  month: <%= buildDate.getMonth()+1 %>,\n' +
        '  date: <%= buildDate.getDate() %>,\n' +
        '  hours: <%= buildDate.getHours() %>,\n' +
        '  minutes: <%= buildDate.getMinutes() %>,\n' +
        '  gmtOffsetMinutes: <%= buildDate.getTimezoneOffset() %>,\n' +
        '  unixTimestamp: <%= buildDate.getTime() %>\n' +
        '};\n'
    })
  ]
};

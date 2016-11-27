var assign = require('lodash.assign');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

function VersionFile(options) {
  var customOptions = options || {};
  var defaults = {
    package: './package.json',
    output: './version.txt',
    templateString: '<%= name %>@<%= version %>\nBuild date: <%= buildDate %>',
    template: '',
    data: {}
  };

  this.options = assign({}, defaults, customOptions);

  var packageData = require(path.join(__dirname, this.options.package));

  this.data = assign(
    {},
    packageData,
    { buildDate: new Date() },
    this.options.data
  );
}

VersionFile.prototype.apply = function () {
  if (this.options.template) {
    fs.readFile(this.options.template, { encoding: 'utf8' }, function (error, content) {
      if (error) {
        throw error;
      }

      this.writeFile(content);
    }.bind(this));
  } else {
    this.writeFile(this.options.templateString);
  }
};

VersionFile.prototype.writeFile = function (template) {
  var renderedTemplate = ejs.render(template, this.data);

  fs.writeFile(this.options.output, renderedTemplate, { flag: 'w' }, function (error) {
    if (error) {
      return console.log(error);
    }

    console.log('✅ Version file written to ' + this.options.output);
  }.bind(this));
}

module.exports = VersionFile;

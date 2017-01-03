var assign = require('lodash.assign');
var ejs = require('ejs');
var fs = require('fs');
var chalk = require('chalk');

function VersionFile(options) {
  // Override default options with custom ones
  var customOptions = options || {};
  var defaults = {
    package: './package.json',
    output: './version.txt',
    templateString: '<%= name %>@<%= version %>\nBuild date: <%= buildDate %>',
    template: '',
    data: {}
  };

  this.options = assign({}, defaults, customOptions);

  // Try to read the content of the provided package.json file
  try {
    var packageFile = fs.readFileSync(this.options.package, 'utf8');
    var packageData = JSON.parse(packageFile);
  } catch (error) {
    throw new Error('Wrong route to package.json file.');
  }

  // Data to be passed in to the templating engine
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
        throw new Error(error);
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

    var successMessage = chalk.bgGreen.white('Version file written to ' + this.options.output);

    console.log(successMessage);
  }.bind(this));
};

module.exports = VersionFile;

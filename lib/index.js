'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_OPTIONS = {
  verbose: false,
  package: './package.json',
  output: './version.txt',
  templateString: '<%= name %>@<%= version %>\nBuild date: <%= buildDate %>\n',
  template: '',
  data: {}
};

var VersionFile = function () {
  function VersionFile() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, VersionFile);

    // Override default options with custom ones
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    // Make sure there's either a valid template or templateString
    if (!this.options.template && !this.options.templateString) {
      throw new Error('Please provide a valid template or templateString.');
    }

    // Make sure the user passed in the route to the file to write
    if (!this.options.output) {
      throw new Error('Please provide a valid path for the output file.');
    }

    // Make sure the user passed in the route to the package.json file
    if (!this.options.package) {
      throw new Error('Please provide the path to your package.json file.');
    }

    // Try to read the content of the provided package.json file
    var rawPackage = readFile(this.options.package);
    var parsedPackage = JSON.parse(rawPackage);

    // Data to be passed in to the templating engine
    this.data = Object.assign({}, parsedPackage, { buildDate: new Date() }, this.options.data);
  }

  _createClass(VersionFile, [{
    key: 'apply',
    value: function apply() {
      // If there's both an inline template and a template file defined, favour the template file
      var template = void 0;

      if (this.options.template) {
        template = readFile(this.options.template);
      } else {
        template = this.options.templateString;
      }

      // Get all the variables being used in the template,
      // and make sure the corresponding values have been provided in `this.data`
      var dataKeys = Object.keys(this.data);
      var templateVariablesRegex = /<%= (.+?) %>/g;
      var regexMatches = template.match(templateVariablesRegex);
      var variablesNotPopulated = [];
      if (regexMatches) {
        variablesNotPopulated = regexMatches.map(function (variable) {
          return variable.replace('<%=', '');
        }).map(function (variable) {
          return variable.replace('%>', '');
        }).map(function (variable) {
          return variable.trim();
        }).map(getRootVariableForNestedObjects).filter(function (variable) {
          return dataKeys.indexOf(variable) === -1;
        });
      }

      if (variablesNotPopulated.length > 0) {
        var variableCollocation = variablesNotPopulated.length > 1 ? 'variables' : 'variable';
        var haveNotCollocation = variablesNotPopulated.length > 1 ? 'haven\'t' : 'hasn\'t';
        var listOfVariables = variablesNotPopulated.join(', ');

        throw new Error('You are using the following ' + variableCollocation + ' which ' + haveNotCollocation + ' been populated: ' + listOfVariables);
      }

      // Get the parsed template
      var content = render(template, this.data);

      // Write file to disk
      writeFile(this.options.output, content, this.options.verbose);
    }
  }]);

  return VersionFile;
}();

/**
 * Returns a parsed string based on the template and data provided
 *
 * @param   {string} template Template string used by EJS
 * @param   {object} data     Data object to hydrate the template with
 * @returns {string}          Rendered template
 */


function render(template, data) {
  return _ejs2.default.render(template, data);
}

/**
 * Returns a file contents. This is a synchronous, blocking operation.
 *
 * @param   {string} path Path to the file we want to read
 * @returns {string}      File contents
 */
function readFile(path) {
  try {
    var contents = _fs2.default.readFileSync(path, { encoding: 'utf8' });

    return contents;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Writes a file to disk with the provided content
 *
 * @param {string} path    Path to the file we want to create
 * @param {string} content File contents
 */
function writeFile(pathToFile, content, verbose) {
  var directory = _path2.default.dirname(pathToFile);

  // Create directory if it doesn't exist
  if (!_fs2.default.existsSync(directory)) {
    _fs2.default.mkdirSync(directory);
  }

  // Try to write file to disk to the given location
  _fs2.default.writeFile(pathToFile, content, { flag: 'w' }, function (error) {
    if (error) {
      throw new Error(error);
    }

    // Log success message to the console if in verbose mode only
    if (verbose) {
      var successMessage = '\nVersion file written to ' + _chalk2.default.green(pathToFile);

      console.log(successMessage);
    }
  });
}

/**
 * Given a string which represents a variable or path to a nested object property/array element,
 * this function returns the name of the original variable ignoring the nesting.
 *
 * @param {string} variable   Variable string, can be a nested object or array
 * @param {string}            Name of the variable w/o nesting
 */
function getRootVariableForNestedObjects(variable) {
  var indexOfFirstDot = variable.indexOf('.');
  var indexOfFirstBracket = variable.indexOf('[');
  var indexOfFirstOccurrence = null;

  if (indexOfFirstDot >= 0 && indexOfFirstBracket >= 0) {
    indexOfFirstOccurrence = Math.min(indexOfFirstDot, indexOfFirstBracket);
  } else if (indexOfFirstDot >= 0 && indexOfFirstBracket < 0) {
    indexOfFirstOccurrence = indexOfFirstDot;
  } else if (indexOfFirstBracket >= 0 && indexOfFirstDot < 0) {
    indexOfFirstOccurrence = indexOfFirstBracket;
  }

  return indexOfFirstOccurrence !== null ? variable.slice(0, indexOfFirstOccurrence) : variable;
}

// We export this function so that we can test it.
VersionFile.getRootVariableForNestedObjects = getRootVariableForNestedObjects;

module.exports = VersionFile;
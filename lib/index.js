'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VersionFile = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_OPTIONS = {
  package: './package.json',
  output: './version.txt',
  templateString: '<%= name %>@<%= version %>\nBuild date: <%= buildDate %>',
  template: '',
  data: {}
};

var VersionFile = exports.VersionFile = function () {
  function VersionFile() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, VersionFile);

    // Override default options with custom ones
    this.options = (0, _lodash2.default)({}, DEFAULT_OPTIONS, options);

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
    this.data = (0, _lodash2.default)({}, parsedPackage, { buildDate: new Date() }, this.options.data);
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

      // Get the parsed template
      var content = render(template, this.data);

      // Write file to disk
      writeFile(this.options.output, content);
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
function writeFile(path, content) {
  _fs2.default.writeFile(path, content, { flag: 'w' }, function (error) {
    if (error) {
      throw new Error(error);
    }

    var successMessage = _chalk2.default.bgGreen.white('Version file written to ' + path);

    console.log(successMessage);
  });
}
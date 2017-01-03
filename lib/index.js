'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var VersionFile = function () {
  function VersionFile() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, VersionFile);

    // Override default options with custom ones
    this.options = (0, _lodash2.default)({}, DEFAULT_OPTIONS, options);

    // Try to read the content of the provided package.json file
    try {
      var rawPackageData = _fs2.default.readFileSync(this.options.package, 'utf8');
      var parsedPackageData = JSON.parse(rawPackageData);

      // Data to be passed in to the templating engine
      this.data = (0, _lodash2.default)({}, parsedPackageData, { buildDate: new Date() }, this.options.data);
    } catch (error) {
      throw new Error('Wrong route to package.json file.');
    }
  }

  _createClass(VersionFile, [{
    key: 'apply',
    value: function apply() {
      var _this = this;

      if (!this.options.template || !this.options.templateString) {
        throw new Error('Please provide a template or templateString through the options object.');
      }

      // If there's both an inline template and a template file defined, favour the template file
      if (this.options.template) {
        // @TODO: move readFile to a helper method just like writeFile is
        _fs2.default.readFile(this.options.template, { encoding: 'utf8' }, function (error, template) {
          if (error) {
            throw new Error(error);
          }

          var content = render(template, _this.data);

          writeFile(_this.options.output, content);
        });
      } else {
        var content = render(this.options.templateString, this.data);

        writeFile(this.options.output, content);
      }
    }
  }]);

  return VersionFile;
}();

/**
 * Returns a parsed string based on the template and data provided
 *
 * @param   {string} template Template string used by EJS
 * @param   {object} data     Data object to hydrate the template with
 * @returns {string}
 */


exports.default = VersionFile;
function render(template, data) {
  return _ejs2.default.render(template, data);
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
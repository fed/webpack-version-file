import assign from 'lodash.assign';
import chalk from 'chalk';
import ejs from 'ejs';
import fs from 'fs';

const DEFAULT_OPTIONS = {
  package: './package.json',
  output: './version.txt',
  templateString: '<%= name %>@<%= version %>\nBuild date: <%= buildDate %>',
  template: '',
  data: {}
};

export default class VersionFile {
  constructor(options = {}) {
    // Override default options with custom ones
    this.options = assign({}, DEFAULT_OPTIONS, options);

    // Try to read the content of the provided package.json file
    try {
      const rawPackageData = fs.readFileSync(this.options.package, 'utf8');
      const parsedPackageData = JSON.parse(rawPackageData);

      // Data to be passed in to the templating engine
      this.data = assign(
        {},
        parsedPackageData,
        { buildDate: new Date() },
        this.options.data
      );
    } catch (error) {
      throw new Error('Wrong route to package.json file.');
    }
  }

  apply() {
    if (!this.options.template || !this.options.templateString) {
      throw new Error('Please provide a template or templateString through the options object.');
    }

    // If there's both an inline template and a template file defined, favour the template file
    if (this.options.template) {
      // @TODO: move readFile to a helper method just like writeFile is
      fs.readFile(this.options.template, { encoding: 'utf8' }, (error, template) => {
        if (error) {
          throw new Error(error);
        }

        const content = render(template, this.data);

        writeFile(this.options.output, content);
      });
    } else {
      const content = render(this.options.templateString, this.data);

      writeFile(this.options.output, content);
    }
  }
}


/**
 * Returns a parsed string based on the template and data provided
 *
 * @param   {string} template Template string used by EJS
 * @param   {object} data     Data object to hydrate the template with
 * @returns {string}
 */
function render(template, data) {
  return ejs.render(template, data);
}


/**
 * Writes a file to disk with the provided content
 *
 * @param {string} path    Path to the file we want to create
 * @param {string} content File contents
 */
function writeFile(path, content) {
  fs.writeFile(path, content, { flag: 'w' }, (error) => {
    if (error) {
      throw new Error(error);
    }

    const successMessage = chalk.bgGreen.white('Version file written to ' + path);

    console.log(successMessage);
  });
}

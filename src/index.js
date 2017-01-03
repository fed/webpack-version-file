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

    // Validations
    if (!this.options.template || !this.options.templateString) {
      throw new Error('Please provide a valid template or templateString.');
    }

    if (!this.options.output) {
      throw new Error('Please provide a valid path for the output file.');
    }

    if (!this.options.package) {
      throw new Error('Please provide a valid path to your package.json file.');
    }

    // Try to read the content of the provided package.json file
    const rawPackage = readFile(this.options.package);
    const parsedPackage = JSON.parse(rawPackage);

    // Data to be passed in to the templating engine
    this.data = assign(
      {},
      parsedPackage,
      { buildDate: new Date() },
      this.options.data
    );
  }

  apply() {
    // If there's both an inline template and a template file defined, favour the template file
    let template;

    if (this.options.template) {
      template = readFile(this.options.template);
    } else {
      template = this.options.templateString;
    }

    // Get the parsed template
    const content = render(template, this.data);

    // Write file to disk
    writeFile(this.options.output, content);
  }
}


/**
 * Returns a parsed string based on the template and data provided
 *
 * @param   {string} template Template string used by EJS
 * @param   {object} data     Data object to hydrate the template with
 * @returns {string}          Rendered template
 */
function render(template, data) {
  return ejs.render(template, data);
}


/**
 * Returns a file contents. This is a synchronous, blocking operation.
 *
 * @param   {string} path Path to the file we want to read
 * @returns {string}      File contents
 */
function readFile(path) {
  try {
    const contents = fs.readFileSync(path, { encoding: 'utf8' });

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
  fs.writeFile(path, content, { flag: 'w' }, (error) => {
    if (error) {
      throw new Error(error);
    }

    const successMessage = chalk.bgGreen.white('Version file written to ' + path);

    console.log(successMessage);
  });
}

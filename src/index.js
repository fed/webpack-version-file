import assign from 'lodash.assign';
import chalk from 'chalk';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

const DEFAULT_OPTIONS = {
  verbose: false,
  package: './package.json',
  output: './version.txt',
  templateString: '<%= name %>@<%= version %>\nBuild date: <%= buildDate %>',
  template: '',
  data: {}
};

class VersionFile {
  constructor(options = {}) {
    // Override default options with custom ones
    this.options = assign({}, DEFAULT_OPTIONS, options);

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
    writeFile(this.options.output, content, this.options.verbose);
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
function writeFile(pathToFile, content, verbose) {
  const directory = path.dirname(pathToFile);

  // Create directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  // Try to write file to disk to the given location
  fs.writeFile(pathToFile, content, { flag: 'w' }, (error) => {
    if (error) {
      throw new Error(error);
    }

    // Log success message to the console if in verbose mode only
    if (verbose) {
      const successMessage = `\nVersion file written to ${chalk.green(pathToFile)}`;

      console.log(successMessage);
    }
  });
}

module.exports = VersionFile;

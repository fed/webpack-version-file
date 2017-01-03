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

    // If there's both an inline template and a template file defined, favour the inline template
    if (this.options.template) {
      fs.readFile(this.options.template, { encoding: 'utf8' }, (error, content) => {
        if (error) {
          throw new Error(error);
        }

        this.writeFile(content);
      });
    } else {
      this.writeFile(this.options.templateString);
    }
  }

  writeFile(template) {
    const renderedTemplate = ejs.render(template, this.data);

    fs.writeFile(this.options.output, renderedTemplate, { flag: 'w' }, (error) => {
      if (error) {
        const errorMessage = chalk.bgRed.white(error);

        console.log(errorMessage);

        return false;
      }

      const successMessage = chalk.bgGreen.white('Version file written to ' + this.options.output);

      console.log(successMessage);
    });
  }
}

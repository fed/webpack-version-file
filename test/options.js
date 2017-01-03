import expect from 'expect';
import VersionFile from '../lib/index';

describe('Version File Webpack Plugin - Options', () => {
  it('has an options property', () => {
    const plugin = new VersionFile();

    expect(plugin.options).toExist();
  });

  it('has the correct number of settings by default', () => {
    const plugin = new VersionFile();

    expect(Object.keys(plugin.options).length).toEqual(5);
  });

  it('defaults to the correct set of options', () => {
    const plugin = new VersionFile();
    const defaultOptions = {
      package: './package.json',
      output: './version.txt',
      templateString: '<%= name %>@<%= version %>\nBuild date: <%= buildDate %>',
      template: '',
      data: {}
    };

    expect(plugin.options).toEqual(defaultOptions);
  });

  it('overrides default options as expected', () => {
    const options = {
      package: './test/mock-package.json',
      output: './build/exposed-version.txt',
      templateString: null,
      template: './src/version-template.ejs',
      data: null
    };
    const plugin = new VersionFile(options);
    const expectedOptions = {
      package: './test/mock-package.json',
      output: './build/exposed-version.txt',
      templateString: null,
      template: './src/version-template.ejs',
      data: null
    };

    expect(plugin.options).toEqual(expectedOptions);
  });

  it('fails if it cannot load the package.json file provided', () => {
    const options = {
      package: './incorrect-path-to-package.json'
    };

    expect(() => new VersionFile(options)).toThrow('Wrong route to package.json file.');
  });

  it('fails if no template or templateString is provided', () => {
    const options = {
      template: null,
      templateString: null
    };

    expect(() => new VersionFile(options).apply())
      .toThrow('Please provide a template or templateString through the options object.');
  });

  // it('fails if it cannot load the template file provided', () => {
  //   const options = {
  //     template: './incorrect-path-to-template.ejs'
  //   };

  //   expect(() => new VersionFile(options)).toThrow('Wrong route to package.json file.');
  // });
});

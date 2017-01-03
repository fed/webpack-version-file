import expect from 'expect';
import VersionFile from '../src/index';

describe('Version File Webpack Plugin - Options', () => {
  it('has an options property', () => {
    const plugin = new VersionFile();

    expect(plugin.options).toExist();
  });

  it('has an options property with the correct number of settings', () => {
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
      output: './build/exposed-version.txt',
      template: './src/version.ejs'
    };
    const plugin = new VersionFile(options);
    const expectedOptions = {
      package: './package.json',
      output: './build/exposed-version.txt',
      templateString: '<%= name %>@<%= version %>\nBuild date: <%= buildDate %>',
      template: './src/version.ejs',
      data: {}
    };

    expect(plugin.options).toEqual(expectedOptions);
  });

  it('fails if it cannot load the package.json file provided', () => {
    const options = {
      package: './incorrect-path-to-package.json'
    };

    expect(new VersionFile(options)).toThrow(new Error);
  });
});

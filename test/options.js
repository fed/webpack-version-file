import { expect } from 'chai';
import VersionFile from '../lib';

describe('Version File Webpack Plugin - Options', () => {
  it('has an options property', () => {
    const plugin = new VersionFile();

    expect(plugin.options).to.exist;
  });

  it('has the correct number of settings by default', () => {
    const plugin = new VersionFile();

    expect(Object.keys(plugin.options).length).to.equal(6);
  });

  it('defaults to the correct set of options', () => {
    const plugin = new VersionFile();
    const defaultOptions = {
      verbose: false,
      package: './package.json',
      output: './version.txt',
      templateString: '<%= name %>@<%= version %>\nBuild date: <%= buildDate %>\n',
      template: '',
      data: {}
    };

    expect(plugin.options).to.deep.equal(defaultOptions);
  });

  it('overrides default options as expected', () => {
    const options = {
      verbose: true,
      package: './test/mock-package.json',
      output: './build/exposed-version.txt',
      templateString: null,
      template: './src/version-template.ejs',
      data: null
    };
    const plugin = new VersionFile(options);
    const expectedOptions = {
      verbose: true,
      package: './test/mock-package.json',
      output: './build/exposed-version.txt',
      templateString: null,
      template: './src/version-template.ejs',
      data: null
    };

    expect(plugin.options).to.deep.equal(expectedOptions);
  });

  it('fails if it cannot load the package.json file provided', () => {
    const options = {
      package: './incorrect-path-to-package.json'
    };

    expect(() => new VersionFile(options)).to.throw();
  });

  it('fails if no template or templateString is provided', () => {
    const options = {
      template: null,
      templateString: null
    };

    expect(() => new VersionFile(options))
      .to.throw('Please provide a valid template or templateString.');
  });

  it('fails if no path to the output file is provided', () => {
    const options = {
      output: null
    };

    expect(() => new VersionFile(options))
      .to.throw('Please provide a valid path for the output file.');
  });

  it('fails if no package.json is provided', () => {
    const options = {
      package: null
    };

    expect(() => new VersionFile(options))
      .to.throw('Please provide the path to your package.json file.');
  });
});

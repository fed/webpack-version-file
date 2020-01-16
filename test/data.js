import { expect } from 'chai';
import VersionFile from '../lib';
import { version } from '../package';

describe('Version File Webpack Plugin - Data', () => {
  it('has a data property', () => {
    const plugin = new VersionFile();

    expect(plugin.data).to.exist;
  });

  it('holds the package name', () => {
    const plugin = new VersionFile();

    expect(plugin.data.name).to.exist;
    expect(plugin.data.name).to.equal('webpack-version-file');
  });

  it('holds the package version number', () => {
    const plugin = new VersionFile();

    expect(plugin.data.version).to.exist;
    expect(plugin.data.version).to.equal(version);
  });

  it('stores the correct package name', () => {
    const plugin = new VersionFile({
      package: './test/mock-package.json'
    });

    expect(plugin.data.name).to.equal('this-is-a-mock-package-json');
  });

  it('stores the correct package name', () => {
    const plugin = new VersionFile({
      package: './test/mock-package.json'
    });

    expect(plugin.data.version).to.equal('1.2.3');
  });

  it('holds the current date', () => {
    const plugin = new VersionFile();

    expect(plugin.data.buildDate).to.be.an.instanceof(Date);
  });

  it('holds any custom data thas has been passed in through options', () => {
    const plugin = new VersionFile({
      data: {
        username: 'johndoe',
        email: 'john@doe.com',
        randomNumber: 17
      }
    });

    expect(plugin.data.username).to.equal('johndoe');
    expect(plugin.data.email).to.equal('john@doe.com');
    expect(plugin.data.randomNumber).to.equal(17);
  });

  it('allows overwriting the name, version or buildDate fields', () => {
    const plugin = new VersionFile({
      package: './test/mock-package.json',
      data: {
        name: 'new-package-name',
        version: '4.5.6',
        buildDate: 'Today'
      }
    });

    expect(plugin.data.name).to.equal('new-package-name');
    expect(plugin.data.version).to.equal('4.5.6');
    expect(plugin.data.buildDate).to.equal('Today');
  });

  it('it allows using template strings without variables', () => {
    const stringVersion = '1.33.7';
    const plugin = new VersionFile({
      templateString: stringVersion,
    });

    expect(() => plugin.apply()).not.to.throw();
  })
});

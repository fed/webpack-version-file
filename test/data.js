import expect from 'expect';
import VersionFile from '../lib/index';
import {version} from '../package';

describe('Version File Webpack Plugin - Data', () => {
  it('has a data property', () => {
    const plugin = new VersionFile();

    expect(plugin.data).toExist();
  });

  it('holds the package name', () => {
    const plugin = new VersionFile();

    expect(plugin.data.name).toExist();
    expect(plugin.data.name).toEqual('webpack-version-file');
  });

  it('holds the package version number', () => {
    const plugin = new VersionFile();

    expect(plugin.data.version).toExist();
    expect(plugin.data.version).toEqual(version);
  });

  it('stores the correct package name', () => {
    const plugin = new VersionFile({
      package: './test/mock-package.json'
    });

    expect(plugin.data.name).toEqual('this-is-a-mock-package-json');
  });

  it('stores the correct package name', () => {
    const plugin = new VersionFile({
      package: './test/mock-package.json'
    });

    expect(plugin.data.version).toEqual('1.2.3');
  });

  it('holds the current date', () => {
    const plugin = new VersionFile();

    expect(plugin.data.buildDate).toBeA(Date);
  });

  it('holds any custom data thas has been passed in through options', () => {
    const plugin = new VersionFile({
      data: {
        username: 'johndoe',
        email: 'john@doe.com',
        randomNumber: 17
      }
    });

    expect(plugin.data.username).toEqual('johndoe');
    expect(plugin.data.email).toEqual('john@doe.com');
    expect(plugin.data.randomNumber).toEqual(17);
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

    expect(plugin.data.name).toEqual('new-package-name');
    expect(plugin.data.version).toEqual('4.5.6');
    expect(plugin.data.buildDate).toEqual('Today');
  });
});

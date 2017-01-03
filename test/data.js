import expect from 'expect';
import VersionFile from '../src/index';

describe('Version File Webpack Plugin - Data', () => {
  it('has a data property', () => {
    const plugin = new VersionFile();

    expect(plugin.data).toExist();
  });

  it('has a data property which holds the package name', () => {
    const plugin = new VersionFile();

    expect(plugin.data.name).toExist();
  });

  it('has a data property which holds the package version number', () => {
    const plugin = new VersionFile();

    expect(plugin.data.version).toExist();
  });

  it('has a data property which holds the current date', () => {
    const plugin = new VersionFile();

    expect(plugin.data.buildDate).toBeA(Date);
  });

  it('has holds any custom data thas has been passed in through options', () => {
    const plugin = new VersionFile({
      data: {
        name: 'John',
        email: 'john@doe.com',
        randomNumber: 42
      }
    });

    expect(plugin.data.name).toEqual('John');
    expect(plugin.data.email).toEqual('john@doe.com');
    expect(plugin.data.randomNumber).toEqual(42);
  });
});

import expect from 'expect';
import VersionFile from '../src/index';

describe('Version File Webpack Plugin', () => {
  it('can be instantiated', () => {
    const plugin = new VersionFile();

    expect(plugin).toExist();
  });

  it('is a function constructor', () => {
    expect(VersionFile).toBeA(Function);
  });

  it('has an apply method attached', () => {
    const plugin = new VersionFile();

    console.log(plugin.apply);

    console.log(Function.prototype.apply);
    expect(plugin.apply).toExist();
  });

  it('has a writeFile method attached', () => {
    const plugin = new VersionFile();

    expect(plugin.writeFile).toExist();
  });
});

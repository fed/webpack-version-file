import expect from 'expect';
import VersionFile from '../lib/index';

describe('Version File Webpack Plugin', () => {
  it('can be instantiated', () => {
    const plugin = new VersionFile();

    expect(plugin).toExist();
  });

  it('is a function constructor', () => {
    expect(VersionFile).toBeA(Function);
  });

  it('has an apply method', () => {
    const plugin = new VersionFile();

    expect(plugin.apply).toExist();
  });
});

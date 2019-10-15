import { expect } from 'chai';
import { getRootVariableForNestedObjects } from '../lib';

describe('Version File Webpack Plugin - Utils', () => {
  describe('getRootVariableForNestedObjects', () => {
    it('works with primitives', () => {
      expect(getRootVariableForNestedObjects('name')).to.equal('name');
      expect(getRootVariableForNestedObjects('version')).to.equal('version');
    });

    it('works with nested arrays', () => {
      expect(getRootVariableForNestedObjects('keywords[0]')).to.equal('keywords');
      expect(getRootVariableForNestedObjects('keywords[0][1]')).to.equal('keywords');
      expect(getRootVariableForNestedObjects('keywords[0][1][2]')).to.equal('keywords');
    });

    it('works with nested objects with both dot and array notations', () => {
      expect(getRootVariableForNestedObjects('author["name"]')).to.equal('author');
      expect(getRootVariableForNestedObjects('author["name"].first')).to.equal('author');
      expect(getRootVariableForNestedObjects('author.name.first')).to.equal('author');
      expect(getRootVariableForNestedObjects('author["name"]["last"]')).to.equal('author');
      expect(getRootVariableForNestedObjects('author.name["last"]')).to.equal('author');
      expect(getRootVariableForNestedObjects('author.email')).to.equal('author');
      expect(getRootVariableForNestedObjects('author.location.country')).to.equal('author');
    });

    it('works with date objects', () => {
      expect(getRootVariableForNestedObjects('buildDate')).to.equal('buildDate');
      expect(getRootVariableForNestedObjects('buildDate.getYear()+1900')).to.equal('buildDate');
      expect(getRootVariableForNestedObjects('buildDate.getMonth()+1')).to.equal('buildDate');
      expect(getRootVariableForNestedObjects('buildDate.getDate()')).to.equal('buildDate');
      expect(getRootVariableForNestedObjects('buildDate.getHours()')).to.equal('buildDate');
      expect(getRootVariableForNestedObjects('buildDate.getMinutes()')).to.equal('buildDate');
      expect(getRootVariableForNestedObjects('buildDate.getTimezoneOffset()')).to.equal('buildDate');
      expect(getRootVariableForNestedObjects('buildDate.getTime()')).to.equal('buildDate');
    });
  });
});

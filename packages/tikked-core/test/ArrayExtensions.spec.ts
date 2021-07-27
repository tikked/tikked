import '../src/utility/ArrayExtensions';
import { expect } from 'chai';

describe('Array', () => {
  describe('duplicates', () => {
    it('return empty array on empty input', () => {
      expect([].duplicates()).to.eql([]);
    });
    it('return empty array on single value input', () => {
      expect([1].duplicates()).to.eql([]);
    });
    it('return empty array on non-duplicates input', () => {
      expect([1, 2].duplicates()).to.eql([]);
    });
    it('return single element on duplicate input', () => {
      expect([1, 1].duplicates()).to.eql([1]);
    });
    it('return single element on multi-duplicate input', () => {
      expect([1, 1, 1].duplicates()).to.eql([1]);
    });
    it('return single element on duplicate/non-duplicate input', () => {
      expect([1, 1, 2].duplicates()).to.eql([1]);
    });
  });

  describe('unique', () => {
    it('return empty array on empty input', () => {
      expect([].unique()).to.eql([]);
    });
    it('return input array on single value input', () => {
      expect([1].unique()).to.eql([1]);
    });
    it('return input array on non-duplicates input', () => {
      expect([1, 2].unique()).to.eql([1, 2]);
    });
    it('return single element on duplicate input', () => {
      expect([1, 1].unique()).to.eql([1]);
    });
    it('return single element on multi-duplicate input', () => {
      expect([1, 1, 1].unique()).to.eql([1]);
    });
    it('return unique elements on duplicate/non-duplicate input', () => {
      expect([1, 1, 2].unique()).to.eql([1, 2]);
    });
  });

  describe('max', () => {
    it('throws Exception on empty array', () => {
      expect(() => [].max(x => x)).to.throw('Unable to get max value of empty array');
    });
    it('return single element on single value input', () => {
      expect([1].max(x => x)).to.eql(1);
    });
    it('return first element on duplicate values', () => {
      const entries = [
        { key: 'a', value: 1 },
        { key: 'b', value: 1 }
      ];
      expect(entries.max(kv => kv.value).key).to.eql(entries[0].key);
    });
    it('return element with highest value', () => {
      expect([1, 5, 3].max(x => x)).to.eql(5);
    });
  });
});

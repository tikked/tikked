import { expect } from 'chai';
import { validateIsNotEmpty } from '../src/utility/Validators';

describe('validateIsNotEmpty', () => {
  describe('with invalid input', () => {
    [
      // eslint-disable-next-line no-null/no-null
      { text: 'null', value: null },
      // eslint-disable-next-line id-blacklist
      { text: 'undefined', value: undefined },
      { text: 'blank string', value: '' },
      { text: 'empty array', value: [] }
    ].forEach((data) => {
      it(`should throw exception on ${data.text}`, () => {
        expect(() => {
          validateIsNotEmpty(data.value);
        }).to.throw('Value should be non-empty');
      });
    });

    it('should throw exception with custom message', () => {
      // Arrange
      const expectedMessage = 'some message';

      expect(() => {
        validateIsNotEmpty(undefined, expectedMessage);
      }).to.throw(expectedMessage);
    });
  });
  describe('with valid input', () => {
    [
      { text: 'short string', value: 'Hi' },
      { text: 'string with only 0', value: '0' },
      { text: 'long string', value: 'This is a longer string' }
    ].forEach((data) => {
      it(`should not throw exception on ${data.text}`, () => {
        validateIsNotEmpty(data.value);
      });
    });
  });
});

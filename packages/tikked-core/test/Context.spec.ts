import { expect } from 'chai';
import { Context } from '../src/domain/Context';

describe('Context', () => {
  describe('constructor', () => {
    it('should be implemented', () => {
      // Arrange
      const input = {};

      // Act
      const context = new Context(input);

      // Assert (should not throw)
    });

    it('should store input data', () => {
      // Arrange
      const expectedKey = 'key';
      const expectedValue = 'value';
      const input = {
        [expectedKey]: expectedValue
      };

      // Act
      const context = new Context(input);

      // Assert
      expect(context.get(expectedKey)).to.equal(expectedValue);
    });

    it('should create copy of featureFlags argument', () => {
      // Arrange
      const expectedKey = 'key';
      const expectedValue = 'value';
      const input = {
        [expectedKey]: expectedValue
      };

      // Act
      const context = new Context(input);
      input[expectedKey] = '';

      // Assert
      expect(context.get(expectedKey)).to.equal(expectedValue);
    });
  });

  describe('get', () => {
    describe('when constructed with single key', () => {
      const contextData = { key: 'value' };
      const context = new Context(contextData);

      it('should throw when accessing key that does not exist', () => {
        expect(() => context.get('invalidKey')).to.throw(/Key.*invalidKey/);
      });

      it('should return value when accessing key with value', () => {
        // Act
        const res = context.get('key');

        // Assert
        expect(res).to.equal(contextData.key);
      });
    });
  });

  describe('hasKey', () => {
    describe('when constructed with single key', () => {
      const contextData = { key: 'value' };
      const context = new Context(contextData);

      it('should return false for key that does not exist', () => {
        // Act
        const res = context.hasKey('invalidKey');

        // Assert
        expect(res).to.be.false;
      });

      it('should return true for key with value', () => {
        // Act
        const res = context.hasKey('key');

        // Assert
        expect(res).to.be.true;
      });
    });
  });

  describe('Keys', () => {
    it('should be implemented', () => {
      // Arrange
      const context = new Context({});

      // Act
      const keys = context.Keys;

      // Assert (no error thrown)
    });

    describe('when constructed empty', () => {
      const context = new Context({});

      it('should be empty', () => {
        // Arrange
        const expectedKeys = [];

        // Act
        const keys = context.Keys;

        // Assert
        expect(keys).to.eql(expectedKeys);
      });
    });

    describe('when constructed with single key', () => {
      const defaultKey = 'key';
      const defaultValue = 'value';
      const context = new Context({
        [defaultKey]: defaultValue
      });

      it('should contain the key', () => {
        // Arrange
        const expectedKeys = [defaultKey];

        // Act
        const keys = context.Keys;

        // Assert
        expect(keys).to.eql(expectedKeys);
      });
    });

    describe('when constructed with two keys', () => {
      const defaultKey = 'key';
      const defaultKey2 = 'key2';
      const defaultValue = 'value';
      const defaultValue2 = 'value2';
      const context = new Context({
        [defaultKey]: defaultValue,
        [defaultKey2]: defaultValue2
      });

      it('should contain the keys', () => {
        // Arrange
        const expectedKeys = [defaultKey, defaultKey2];

        // Act
        const keys = context.Keys;

        // Assert
        expect(keys).to.eql(expectedKeys);
      });
    });
  });

  describe('toJSON', () => {
    const defaultKey = 'key';
    const defaultValue = 'value';
    const contextData = {
      [defaultKey]: defaultValue
    };
    const context = new Context(contextData);

    it('should return contextData', () => {
      // Arrange
      const expectedJson = { ...contextData };

      // Act
      const json = context.toJSON();

      // Assert
      expect(json).to.eql(expectedJson);
    });
  });

  describe('matchKeyValue', () => {
    describe('when constructed with single key', () => {
      const contextData = { key: 'value' };
      const context = new Context(contextData);

      it('should return false for key that does not exist', () => {
        // Act
        const res = context.matchKeyValue('invalidKey', 'invalidValue');

        // Assert
        expect(res).to.be.false;
      });

      it('should return false for an existing key but invalid value', () => {
        // Act
        const res = context.matchKeyValue('key', 'invalidValue');

        // Assert
        expect(res).to.be.false;
      });

      it('should return true for an existing key and valid value', () => {
        // Act
        const res = context.matchKeyValue('key', 'value');

        // Assert
        expect(res).to.be.true;
      });
    });
  });
});

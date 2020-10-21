import { expect } from 'chai';
import { Context } from '../src/domain/Context';
import { Toggle } from '../src/domain/Toggle';

describe('Toggle', () => {
  describe('constructor', () => {
    it('should be implemented', () => {
      const toggle = new Toggle(true, new Context({}));
    });
  });
  describe('with empty context', () => {
    const emptyContext = new Context({});
    const toggle = new Toggle(true, emptyContext);

    describe('matches', () => {
      it('should be implemented', () => {
        // Act
        toggle.matches(emptyContext);

        // Assert (no error thrown)
      });

      it('when called with empty context should return true', () => {
        // Act
        const res = toggle.matches(emptyContext);

        // Assert
        expect(res).to.be.true;
      });

      it('when called with non-empty context should return true', () => {
        // Act
        const res = toggle.matches(new Context({ key: 'value' }));

        // Assert
        expect(res).to.be.true;
      });
    });
  });

  describe('with single-key context', () => {
    const key = 'key';
    const value = 'value';
    const singleKeyContextData = { [key]: value };
    const singleKeyContext = new Context(singleKeyContextData);
    const emptyContext = new Context({});
    const toggle = new Toggle(true, singleKeyContext);

    describe('matches', () => {
      it('when called with empty context should return false', () => {
        // Act
        const res = toggle.matches(emptyContext);

        // Assert
        expect(res).to.be.false;
      });

      it('when called with matching context should return true', () => {
        // Arrange
        const context = new Context({ ...singleKeyContextData });

        // Act
        const res = toggle.matches(singleKeyContext);

        // Assert
        expect(res).to.be.true;
      });

      it('when called with non-matching non-empty context should return false', () => {
        // Arrange
        const context = new Context({ [key]: value + '2' });

        // Act
        const res = toggle.matches(context);

        // Assert
        expect(res).to.be.false;
      });

      it('when called with excessive matching context should return true', () => {
        // Arrange
        const context = new Context({
          ...singleKeyContextData,
          key2: 'value2'
        });

        // Act
        const res = toggle.matches(context);

        // Assert
        expect(res).to.be.true;
      });
    });
  });

  describe('with multi-key context', () => {
    const key = 'key';
    const key2 = 'key2';
    const value = 'value';
    const value2 = 'value2';
    const multiKeyContextData = { [key]: value, [key2]: value2 };
    const multiKeyContext = new Context(multiKeyContextData);
    const emptyContext = new Context({});
    const toggle = new Toggle(true, multiKeyContext);

    describe('matches', () => {
      it('when called with empty context should return false', () => {
        // Act
        const res = toggle.matches(emptyContext);

        // Assert
        expect(res).to.be.false;
      });

      it('when called with matching context should return true', () => {
        // Arrange
        const context = new Context({ ...multiKeyContextData });

        // Act
        const res = toggle.matches(context);

        // Assert
        expect(res).to.be.true;
      });

      it('when called with partial-matching context should return false', () => {
        // Arrange
        const context = new Context({ [key]: value + '2', [key2]: value2 });

        // Act
        const res = toggle.matches(context);

        // Assert
        expect(res).to.be.false;
      });

      it('when called with partial-matching (second key) context should return false', () => {
        // Arrange
        const context = new Context({ [key]: value, [key2]: value2 + '2' });

        // Act
        const res = toggle.matches(context);

        // Assert
        expect(res).to.be.false;
      });

      it('when called with single-matching-key context should return false', () => {
        // Arrange
        const context = new Context({ [key]: value });

        // Act
        const res = toggle.matches(context);

        // Assert
        expect(res).to.be.false;
      });

      it('when called with single-matching-key (second key) context should return false', () => {
        // Arrange
        const context = new Context({ [key2]: value2 });

        // Act
        const res = toggle.matches(context);

        // Assert
        expect(res).to.be.false;
      });

      it('when called with mixed key-values context should return false', () => {
        // Arrange
        const context = new Context({ [key]: value2, [key2]: value });

        // Act
        const res = toggle.matches(context);

        // Assert
        expect(res).to.be.false;
      });
    });
  });
});

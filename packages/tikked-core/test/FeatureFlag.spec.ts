import { expect } from 'chai';
import { Context } from '../src/domain/Context';
import { FeatureFlag } from '../src/domain/FeatureFlag';
import { Toggle } from '../src/domain/Toggle';
import { SupersetMatcher } from '../src/domain/matchers/SupersetMatcher';
import { createDescription, createId, createName, createToggle } from './Fixture';

describe('FeatureFlag', () => {
  const defaultId = createId();
  const defaultName = createName();
  const defaultDescription = createDescription();
  const defaultToggles = [createToggle()];

  describe('contructor', () => {
    it('should store provided arguments', () => {
      // Act
      const featureFlag = new FeatureFlag(
        defaultId,
        defaultName,
        defaultDescription,
        defaultToggles
      );

      // Assert
      expect(featureFlag.Id).to.equal(defaultId);
      expect(featureFlag.Name).to.equal(defaultName);
      expect(featureFlag.Description).to.equal(defaultDescription);
      expect(featureFlag.Toggles).to.eql(defaultToggles);
    });

    it('should create copy of toggles argument', () => {
      // Arrange
      const toggles = [createToggle()];
      const expectedToggles = [...toggles];

      // Act
      const ff = new FeatureFlag(defaultId, defaultName, defaultDescription, toggles);
      toggles.push(createToggle());

      // Assert
      expect(ff.Toggles).to.eql(expectedToggles);
    });

    it('should throw when there is no toggles', () => {
      // Act
      expect(() => {
        const featureFlag = new FeatureFlag(defaultId, defaultName, defaultDescription, []);
      })
        // Assert
        .to.throw('empty');
    });
  });

  describe('getToggles', () => {
    describe('with single contextual toggle and empty-context toggle', () => {
      const contextData = { key: 'value' };
      const toggle = new Toggle(true, new SupersetMatcher(new Context(contextData)));
      const emptyContextToggle = new Toggle(false, new SupersetMatcher(new Context({})));
      const featureFlag = new FeatureFlag(defaultId, defaultName, defaultDescription, [
        toggle,
        emptyContextToggle
      ]);
      [
        { text: 'empty context', value: new Context({}) },
        {
          text: 'mismatched key context',
          value: new Context({ key1: 'value' })
        },
        {
          text: 'mismatched value context',
          value: new Context({ key: 'value1' })
        }
      ].forEach((data) => {
        it(`should return empty array on input ${data.text}`, () => {
          // Act
          const res = featureFlag.getToggles(data.value);

          // Assers
          expect(res).to.eql([emptyContextToggle]);
        });
      });

      [
        {
          text: 'matching context',
          value: new Context({ ...contextData })
        },
        {
          text: 'matching context with extra',
          value: new Context({ ...contextData, k: 'l' })
        }
      ].forEach((data) => {
        it(`should return toggle on input ${data.text}`, () => {
          // Act
          const res = featureFlag.getToggles(data.value);

          // Assert
          expect(res).to.be.not.empty;
          expect(res).to.contain(toggle);
        });
      });
    });

    describe('with two contextual toggle and empty-context toggle', () => {
      const contextData1 = { key1: 'value1' };
      const contextData2 = { key2: 'value2' };
      const contextDataCombined = { ...contextData1, ...contextData2 };
      const toggle1 = new Toggle(true, new SupersetMatcher(new Context(contextData1)));
      const toggle2 = new Toggle(true, new SupersetMatcher(new Context(contextData2)));
      const emptyContextToggle = new Toggle(false, new SupersetMatcher(new Context({})));
      const featureFlag = new FeatureFlag(defaultId, defaultName, defaultDescription, [
        toggle1,
        toggle2,
        emptyContextToggle
      ]);
      [
        { text: 'empty context', value: new Context({}) },
        {
          text: 'mismatched key context',
          value: new Context({ wrongKey: 'value1' })
        },
        {
          text: 'mismatched value context',
          value: new Context({ key1: 'wrong value' })
        }
      ].forEach((data) => {
        it(`should return empty array on input ${data.text}`, () => {
          // Act
          const res = featureFlag.getToggles(data.value);

          // Assers
          expect(res).to.eql([emptyContextToggle]);
        });
      });

      [
        {
          text: 'matching context',
          value: new Context({ ...contextData1 })
        },
        {
          text: 'matching context with extra',
          value: new Context({ ...contextData1, k: 'l' })
        }
      ].forEach((data) => {
        it(`should return first toggle on input ${data.text}`, () => {
          // Act
          const res = featureFlag.getToggles(data.value);

          // Assert
          expect(res.length).to.equal(2);
          expect(res).to.contain(toggle1);
        });
      });

      [
        {
          text: 'matching context',
          value: new Context({ ...contextData2 })
        },
        {
          text: 'matching context with extra',
          value: new Context({ ...contextData2, k: 'l' })
        }
      ].forEach((data) => {
        it(`should return second toggle on input ${data.text}`, () => {
          // Act
          const res = featureFlag.getToggles(data.value);

          // Assert
          expect(res.length).to.equal(2);
          expect(res).to.contain(toggle2);
        });
      });

      [
        {
          text: 'matching context',
          value: new Context({ ...contextDataCombined })
        },
        // tslint:disable-next-line:max-line-length
        {
          text: 'matching context with extra',
          value: new Context({ ...contextDataCombined, k: 'l' })
        }
      ].forEach((data) => {
        it(`should return both toggles on input ${data.text}`, () => {
          // Act
          const res = featureFlag.getToggles(data.value);

          // Assert
          expect(res.length).to.equal(3);
          expect(res).to.contain(toggle1);
          expect(res).to.contain(toggle2);
        });
      });
    });
  });
});

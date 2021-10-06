import { ApplicationEnvironment } from '../src/domain/ApplicationEnvironment';
import { Context } from '../src/domain/Context';
import { ContextSchema } from '../src/domain/ContextSchema';
import { FeatureFlag } from '../src/domain/FeatureFlag';
import { Toggle } from '../src/domain/Toggle';
import {
  createAttribute,
  createContextSchema,
  createDescription,
  createFeatureFlag,
  createId,
  createName
} from './Fixture';
import { expect } from 'chai';
import { SupersetMatcher } from '../src/domain/matchers/SupersetMatcher';

describe('ApplicationEnvironment', () => {
  describe('contructor', () => {
    const defaultId = 'some_id';
    const defaultName = 'some_name';
    const defaultDescription = 'some_desc';
    const defaultContextSchema = new ContextSchema([]);
    const defaultFeatureFlags = [];

    it('should be valid without any flags', () => {
      // Arrange
      const ffs = [];

      // Act
      const appEnv = new ApplicationEnvironment(
        defaultId,
        defaultName,
        defaultDescription,
        defaultContextSchema,
        ffs
      );

      // Assert (no error thrown)
    });

    it('should be valid a single valid flag', () => {
      // Arrange
      const ffs = [createFeatureFlag()];

      // Act
      const appEnv = new ApplicationEnvironment(
        defaultId,
        defaultName,
        defaultDescription,
        defaultContextSchema,
        ffs
      );

      // Assert (no error thrown)
    });

    it('should be invalid with feature two flags with the same id', () => {
      // Arrange
      const ffs = [createFeatureFlag(defaultId), createFeatureFlag(defaultId)];

      // Act
      expect(() => {
        const appEnv = new ApplicationEnvironment(
          defaultId,
          defaultName,
          defaultDescription,
          defaultContextSchema,
          ffs
        );
      })
        // Assert
        .to.throw(defaultId);
    });

    it('should be invalid with empty string id', () => {
      // Arrange
      const id = '';

      // Act
      expect(() => {
        const appEnv = new ApplicationEnvironment(
          id,
          defaultName,
          defaultDescription,
          defaultContextSchema,
          defaultFeatureFlags
        );
      })
        // Assert
        .to.throw('Id');
    });

    it('should store provided arguments', () => {
      // Act
      const appEnv = new ApplicationEnvironment(
        defaultId,
        defaultName,
        defaultDescription,
        defaultContextSchema,
        defaultFeatureFlags
      );

      // Assert
      expect(appEnv.Id).to.equal(defaultId);
      expect(appEnv.Name).to.equal(defaultName);
      expect(appEnv.Description).to.equal(defaultDescription);
      expect(appEnv.ContextSchema).to.equal(defaultContextSchema);
      expect(appEnv.FeatureFlags).to.eql(defaultFeatureFlags);
    });

    it('should create copy of featureFlags argument', () => {
      // Arrange
      const ffs = [createFeatureFlag()];
      const expectedFfs = [...ffs];

      // Act
      const appEnv = new ApplicationEnvironment(
        defaultId,
        defaultName,
        defaultDescription,
        defaultContextSchema,
        ffs
      );
      ffs.push(createFeatureFlag());

      // Assert
      expect(appEnv.FeatureFlags).to.eql(expectedFfs);
    });
  });
  describe('getFeatureSet', () => {
    describe('with no feature flags', () => {
      const appEnv = new ApplicationEnvironment(
        createId(),
        createName(),
        createDescription(),
        createContextSchema(),
        []
      );
      [
        { text: 'empty context', value: new Context({}) },
        { text: 'one-attribute context', value: new Context({ key: 'value' }) },
        {
          text: 'two-attribute context',
          value: new Context({ key1: 'value1', key2: 'value2' })
        }
      ].forEach(data => {
        it(`should return empty array on input ${data.text}`, () => {
          // Act
          const res = appEnv.getFeatureSet(data.value);

          // Assert
          expect(res).to.be.empty;
        });
      });
    });
    describe('with one feature flag and one-attribute schema', () => {
      const attribute = createId();
      const featureFlagId = createId();
      const attributeValue1 = 'value1';
      const attributeValue2 = 'value2';
      const appEnv = new ApplicationEnvironment(
        createId(),
        createName(),
        createDescription(),
        createContextSchema([createAttribute(attribute)]),
        [
          new FeatureFlag(featureFlagId, createName(), createDescription(), [
            new Toggle(true, new SupersetMatcher(new Context({ [attribute]: attributeValue1 }))),
            new Toggle(true, new SupersetMatcher(new Context({ [attribute]: attributeValue2 })))
          ])
        ]
      );
      [
        {
          text: 'should not include feature flag on empty context',
          value: new Context({}),
          expected: false
        },
        {
          text: 'should include feature flag on context matching attribute value',
          value: new Context({ [attribute]: attributeValue1 }),
          expected: true
        },
        {
          text:
            // eslint-disable-next-line max-len
            'should include feature flag on context matching attribute value with additional unrelated attribute',
          value: new Context({ [attribute]: attributeValue1, someKey: 'val' }),
          expected: true
        },
        {
          text: 'should not include feature flag on context with other value',
          value: new Context({ [attribute]: 'some other value' }),
          expected: false
        }
      ].forEach(data => {
        it(data.text, () => {
          // Act
          const res = appEnv.getFeatureSet(data.value);

          // Assert
          expect(res.has(featureFlagId)).to.be.equal(data.expected);
        });
      });
    });
    describe('with two feature flags and two-attribute schema', () => {
      const attribute1 = createId();
      const attribute2 = createId();
      const featureFlagId1 = createId();
      const featureFlagId2 = createId();
      const attributeValue1 = 'value1';
      const attributeValue2 = 'value2';
      const appEnv = new ApplicationEnvironment(
        createId(),
        createName(),
        createDescription(),
        createContextSchema([createAttribute(attribute1), createAttribute(attribute2)]),
        [
          new FeatureFlag(featureFlagId1, createName(), createDescription(), [
            new Toggle(true, new SupersetMatcher(new Context({ [attribute1]: attributeValue1 })))
          ]),
          new FeatureFlag(featureFlagId2, createName(), createDescription(), [
            new Toggle(true, new SupersetMatcher(new Context({ [attribute2]: attributeValue2 })))
          ])
        ]
      );
      [
        {
          text: 'single feature flag on context matching attribute value',
          value: new Context({ [attribute1]: attributeValue1 }),
          expected: [featureFlagId1]
        },
        {
          text: 'both feature flags on context matching both attribute values',
          value: new Context({
            [attribute1]: attributeValue1,
            [attribute2]: attributeValue2
          }),
          expected: [featureFlagId1, featureFlagId2]
        },
        {
          // tslint:disable-next-line: max-line-length
          text: 'single feature flag on context matching attribute value and ignore other mismatch',
          value: new Context({
            [attribute1]: 'some other value',
            [attribute2]: attributeValue2
          }),
          expected: [featureFlagId2]
        }
      ].forEach(data => {
        it(`should include ${data.text}`, () => {
          // Act
          const res = appEnv.getFeatureSet(data.value);

          // Assert
          expect(res).to.have.keys(data.expected);
        });
      });
      [
        {
          text: 'feature flags on empty context',
          value: new Context({})
        },
        {
          text: 'feature flag on context with other values on both attributes',
          value: new Context({
            [attribute1]: 'some other value',
            [attribute2]: 'yet another value'
          })
        }
      ].forEach(data => {
        it(`should not include ${data.text}`, () => {
          // Act
          const res = appEnv.getFeatureSet(data.value);

          // Assert
          expect(res).to.be.empty;
        });
      });
    });
  });
});

import { expect } from 'chai';
import { ApplicationEnvironment } from 'tikked-core';
import { JsonCoder } from '../src/persistency/JsonCoder';
import {
  createAttribute,
  createContextSchema,
  createDescription,
  createFeatureFlag,
  createId,
  createName
} from './Fixture';

describe('JsonCoder', () => {
  describe('decode', () => {
    describe('with no feature flags and no attributes', () => {
      // Arrange
      const decoder = new JsonCoder();
      const id = createId();
      const name = createName();
      const description = createDescription();
      const contextSchema = {
        attributes: []
      };
      const featureFlags = [];
      const runDecoder = () =>
        decoder.decode(
          JSON.stringify({
            id,
            name,
            description,
            contextSchema,
            featureFlags
          })
        );

      it('should decode to something', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res).to.be.not.undefined;
      });

      it('should store the application environment id', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.Id).to.be.equal(id);
      });

      it('should store the application environment name', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.Name).to.be.equal(name);
      });

      it('should store the application environment description', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.Description).to.be.equal(description);
      });

      it('should store the empty context schema', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.ContextSchema).to.be.not.undefined;
        expect(res.ContextSchema.Attributes).to.be.empty;
      });

      it('should store the empty feature flags', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.FeatureFlags).to.be.empty;
      });
    });
    describe('with missing attributes', () => {
      // Arrange
      const decoder = new JsonCoder();
      const id = createId();
      const name = createName();
      const description = createDescription();
      const contextSchema = {
        attributes: []
      };
      const featureFlags = [];

      it('throw when missing id', () => {
        // Act
        expect(() => {
          const res = decoder.decode(
            JSON.stringify({
              name,
              description,
              contextSchema,
              featureFlags
            })
          );
        })
          // Assert
          .to.throw('id');
      });

      it('throw when missing name', () => {
        // Act
        expect(() => {
          const res = decoder.decode(
            JSON.stringify({
              id,
              description,
              contextSchema,
              featureFlags
            })
          );
        })
          // Assert
          .to.throw('name');
      });

      it('throw when missing description', () => {
        // Act
        expect(() => {
          const res = decoder.decode(
            JSON.stringify({
              id,
              name,
              contextSchema,
              featureFlags
            })
          );
        })
          // Assert
          .to.throw('description');
      });

      it('throw when missing context schema', () => {
        // Act
        expect(() => {
          const res = decoder.decode(
            JSON.stringify({
              id,
              name,
              description,
              featureFlags
            })
          );
        })
          // Assert
          .to.throw('contextSchema');
      });

      it('throw when missing feature flags', () => {
        // Act
        expect(() => {
          const res = decoder.decode(
            JSON.stringify({
              id,
              name,
              description,
              contextSchema
            })
          );
        })
          // Assert
          .to.throw('featureFlags');
      });
    });
    describe('with feature flags and no attributes', () => {
      // Arrange
      const decoder = new JsonCoder();
      const id = createId();
      const name = createName();
      const description = createDescription();
      const isActive = true;
      const context = {};
      const contextSchema = {
        attributes: []
      };
      const featureFlags = [
        {
          id,
          name,
          description,
          toggles: [
            {
              isActive,
              context
            }
          ]
        }
      ];
      const runDecoder = () =>
        decoder.decode(
          JSON.stringify({
            id: createId(),
            name: createName(),
            description: createDescription(),
            contextSchema,
            featureFlags
          })
        );

      it('should decode the feature flags', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.FeatureFlags).to.be.not.empty;
      });

      it('should decode the id of the feature flag', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.FeatureFlags[0].Id).to.be.equal(id);
      });

      it('should decode the name of the feature flag', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.FeatureFlags[0].Name).to.be.equal(name);
      });

      it('should decode the description of the feature flag', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.FeatureFlags[0].Description).to.be.equal(description);
      });

      it('should decode the toggles of the feature flag', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.FeatureFlags[0].Toggles).to.be.not.empty;
      });

      it('should decode the toggles->isActive of the feature flag', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.FeatureFlags[0].Toggles[0].IsActive).to.be.equal(isActive);
      });

      it('should decode the toggles->context of the feature flag', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.FeatureFlags[0].Toggles[0].Context.Keys).to.be.empty;
      });
    });
    describe('with no feature flags and with attributes', () => {
      // Arrange
      const decoder = new JsonCoder();
      const id = createId();
      const name = createName();
      const description = createDescription();
      const contextSchema = {
        attributes: [
          {
            id,
            name,
            description
          }
        ]
      };
      const featureFlags = [];
      const runDecoder = () =>
        decoder.decode(
          JSON.stringify({
            id: createId(),
            name: createName(),
            description: createDescription(),
            contextSchema,
            featureFlags
          })
        );

      it('should decode the attributes of the context schema', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.ContextSchema).to.be.not.undefined;
        expect(res.ContextSchema.Attributes).to.be.not.empty;
      });

      it('should store id of attribute in context schema', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.ContextSchema.Attributes[0].Id).to.be.equal(id);
      });

      it('should store name of attribute in context schema', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.ContextSchema.Attributes[0].Name).to.be.equal(name);
      });

      it('should store description of attribute in context schema', () => {
        // Act
        const res = runDecoder();

        // Assert
        expect(res.ContextSchema.Attributes[0].Description).to.be.equal(
          description
        );
      });
    });
  });
  describe('encode', () => {
    describe('with no feature flags and no attributes', () => {
      // Arrange
      const id = createId();
      const name = createName();
      const description = createDescription();
      const contextSchema = createContextSchema();
      const appEnv = new ApplicationEnvironment(
        id,
        name,
        description,
        contextSchema,
        []
      );
      const decoder = new JsonCoder();
      const runEncode = () => decoder.encode(appEnv);

      it('should encode something', () => {
        // Act
        const res = runEncode();

        // Assert
        expect(res).to.be.not.undefined;
      });

      it('should encode id', () => {
        // Act
        const res = runEncode();

        // Assert
        expect(res).to.contain(`"id":"${id}"`);
      });

      it('should encode name', () => {
        // Act
        const res = runEncode();

        // Assert
        expect(res).to.contain(`"name":"${name}"`);
      });

      it('should encode description', () => {
        // Act
        const res = runEncode();

        // Assert
        expect(res).to.contain(`"description":"${description}"`);
      });

      it('should encode contextSchema', () => {
        // Act
        const res = runEncode();

        // Assert
        expect(res).to.contain('"contextSchema":{"attributes":[]}');
      });

      it('should encode featureFlags', () => {
        // Act
        const res = runEncode();

        // Assert
        expect(res).to.contain('"featureFlags":[]');
      });
    });
  });
  describe('encode->decode mirror', () => {
    const decoder = new JsonCoder();
    [
      {
        text: 'with no feature flags and no attributes',
        value: new ApplicationEnvironment(
          createId(),
          createName(),
          createDescription(),
          createContextSchema([]),
          []
        )
      },
      {
        text: 'with single feature flag and single attribute',
        value: new ApplicationEnvironment(
          createId(),
          createName(),
          createDescription(),
          createContextSchema([createAttribute()]),
          [createFeatureFlag()]
        )
      },
      {
        text: 'with multiple feature flags and multiple attributes',
        value: new ApplicationEnvironment(
          createId(),
          createName(),
          createDescription(),
          createContextSchema([createAttribute(), createAttribute()]),
          [createFeatureFlag(), createFeatureFlag(), createFeatureFlag()]
        )
      }
    ].forEach(data => {
      describe(data.text, () => {
        it('should mirror', () => {
          // Arrange
          const expected = data.value;

          // Act
          const encoded = decoder.encode(data.value);
          const res = decoder.decode(encoded);

          // Assert
          expect(res).to.be.deep.equal(expected);
        });
      });
    });
  });
});

import { expect } from 'chai';
import * as fc from 'fast-check';
import { z } from 'zod';
import {
  ApplicationEnvironment,
  Attribute,
  Context,
  ContextMatcher,
  ContextSchema,
  ExactMatcher,
  FeatureFlag,
  LogicalAndMatcher,
  LogicalNotMatcher,
  LogicalOrMatcher,
  RegexMatcher,
  SupersetMatcher,
  Toggle
} from '@tikked/core';
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
      const matcher = { $superset: context };
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
              matcher
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
        expect((res.FeatureFlags[0].Toggles[0].Matcher as ContextMatcher).Context.Keys).to.be.empty;
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
        expect(res.ContextSchema.Attributes[0].Description).to.be.equal(description);
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
      const appEnv = new ApplicationEnvironment(id, name, description, contextSchema, []);
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

    const decodedAttributes = fc
      .record({
        id: fc.string(),
        name: fc.string(),
        description: fc.string()
      })
      .map((attribute) => new Attribute(attribute.id, attribute.name, attribute.description));

    const decodedContextSchema = fc
      .uniqueArray(decodedAttributes, { minLength: 3, maxLength: 5, selector: (a) => a.Id })
      .map((attributes) => new ContextSchema(attributes));

    const decodedContext = fc
      .object({ maxDepth: 0, values: [fc.hexaString()], maxKeys: 5 })
      .map((c: Record<string, string>) => new Context(c));

    const decodedContextMatcher = fc
      .record({
        constructor: fc.constantFrom(ExactMatcher, SupersetMatcher, RegexMatcher),
        context: decodedContext
      })
      .map((m) => new m.constructor(m.context));

    const decodedNotMatcher = fc.oneof(decodedContextMatcher).map((m) => new LogicalNotMatcher(m));
    const decodedAndMatcher = fc
      .array(decodedContextMatcher, { minLength: 2, maxLength: 5 })
      .map((m) => new LogicalAndMatcher(m));
    const decodedOrMatcher = fc
      .array(decodedContextMatcher, { minLength: 2, maxLength: 5 })
      .map((m) => new LogicalOrMatcher(m));

    const decodedToggle = fc
      .record({
        isActive: fc.boolean(),
        matcher: fc.oneof(
          decodedContextMatcher,
          decodedNotMatcher,
          decodedAndMatcher,
          decodedOrMatcher
        )
      })
      .map((t) => new Toggle(t.isActive, t.matcher));

    const decodedFeatureFlag = fc
      .record({
        id: fc.string({ minLength: 1 }),
        name: fc.string(),
        description: fc.string(),
        toggles: fc.array(decodedToggle, { minLength: 3, maxLength: 5 })
      })
      .map((f) => new FeatureFlag(f.id, f.name, f.description, f.toggles));

    const decodedEnvironment = fc
      .record({
        id: fc.string({ minLength: 1 }),
        name: fc.string(),
        description: fc.string(),
        contextSchema: decodedContextSchema,
        featureFlags: fc.uniqueArray(decodedFeatureFlag, {
          minLength: 3,
          maxLength: 5,
          selector: (ff) => ff.Id
        })
      })
      .map(
        (record) =>
          new ApplicationEnvironment(
            record.id,
            record.name,
            record.description,
            record.contextSchema,
            record.featureFlags
          )
      );

    const encodingMatcherKeys = z.union([
      z.literal('$superset'),
      z.literal('$exact'),
      z.literal('$regex'),
      z.literal('$and'),
      z.literal('$or'),
      z.literal('$not')
    ]);
    const encodingMatcherSchema = z.lazy(() =>
      z.record(
        encodingMatcherKeys,
        z.union([
          z.record(z.string(), z.string()),
          encodingMatcherSchema,
          z.array(encodingMatcherSchema)
        ])
      )
    );
    const encodingSchema = z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      contextSchema: z.object({
        attributes: z.array(
          z.object({
            id: z.string(),
            name: z.string().optional(),
            description: z.string().optional()
          })
        )
      }),
      featureFlags: z.array(
        z.object({
          id: z.string(),
          name: z.string().optional(),
          description: z.string().optional(),
          toggles: z.array(
            z.object({
              isActive: z.boolean(),
              matcher: encodingMatcherSchema
            })
          )
        })
      )
    });

    it('should produce encoded json data', () => {
      fc.assert(
        fc.property(decodedEnvironment, (data) => {
          const decoder = new JsonCoder();

          const jsonString = decoder.encode(data);
          const result = encodingSchema.safeParse(JSON.parse(jsonString));
          if (!result.success) {
            throw result.error;
          }

          return result.success;
        }),
        { numRuns: 100 }
      );
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
    ].forEach((data) => {
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

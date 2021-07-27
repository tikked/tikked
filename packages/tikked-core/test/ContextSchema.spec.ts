import { expect } from 'chai';
import { Attribute } from '../src/domain/Attribute';
import { Context } from '../src/domain/Context';
import { ContextSchema } from '../src/domain/ContextSchema';
import { Toggle } from '../src/domain/Toggle';
import { createAttribute, createId } from './Fixture';

describe('ContextSchema', () => {
  describe('contructor', () => {
    it('should validate without any flags', () => {
      // Arrange
      const attrs = [];

      // Act
      const schema = new ContextSchema(attrs);

      // Assert (no error thrown)
    });

    it('should validate a single valid flag', () => {
      // Arrange
      const attrs = [createAttribute()];

      // Act
      const schema = new ContextSchema(attrs);

      // Assert (no error thrown)
    });

    it('should invalidate with two attributes with the same id', () => {
      // Arrange
      const id = createId();
      const attrs = [createAttribute(id), createAttribute(id)];

      // Act
      expect(() => {
        const schema = new ContextSchema(attrs);
      })
        // Assert
        .to.throw(new RegExp(`id.*${id}`));
    });

    it('should validate with two attributes of different id', () => {
      // Arrange
      const attrs = [createAttribute(), createAttribute()];

      // Act
      const schema = new ContextSchema(attrs);

      // Assert (no error thrown)
    });

    it('should create copy of attributes argument', () => {
      // Arrange
      const attrs = [createAttribute()];
      const expectedAttrs = [...attrs];

      // Act
      const appEnv = new ContextSchema(attrs);
      attrs.push(createAttribute());

      // Assert
      expect(appEnv.Attributes).to.eql(expectedAttrs);
    });
  });

  describe('filterContext', () => {
    const contextData1 = { key1: 'value1' };
    const contextData2 = { key2: 'value2' };
    const testData = [
      {
        text: 'empty context',
        value: new Context({})
      },
      {
        text: 'single-entry context',
        value: new Context({ ...contextData1 })
      },
      {
        text: 'multi-entry context',
        value: new Context({ ...contextData1, ...contextData2 })
      }
    ];

    describe('with no attributes', () => {
      const schema = new ContextSchema([]);
      testData.forEach(data => {
        it(`should return empty context on ${data.text}`, () => {
          // Act
          const res = schema.filterContext(data.value);

          // Assert
          expect(res.Keys).to.be.empty;
        });
      });
    });

    describe('with single attribute', () => {
      const schema = new ContextSchema([createAttribute('key1')]);
      testData.slice(0, 1).forEach(data => {
        it(`should return empty context on ${data.text}`, () => {
          // Act
          const res = schema.filterContext(data.value);

          // Assert
          expect(res.Keys).to.be.empty;
        });
      });
      testData.slice(1).forEach(data => {
        it(`should return stripped context on ${data.text}`, () => {
          // Act
          const res = schema.filterContext(data.value);

          // Assert
          expect(res.Keys).to.eql(['key1']);
          expect(res.Keys.length).to.equal(1);
        });
      });
    });

    describe('with multiple attribute', () => {
      const schema = new ContextSchema([createAttribute('key1'), createAttribute('key2')]);
      testData.slice(0, 1).forEach(data => {
        it(`should return empty context on ${data.text}`, () => {
          // Act
          const res = schema.filterContext(data.value);

          // Assert
          expect(res.Keys).to.be.empty;
        });
      });
      testData.slice(1, 2).forEach(data => {
        it(`should return full context on ${data.text}`, () => {
          // Act
          const res = schema.filterContext(data.value);

          // Assert
          expect(res.Keys).to.eql(['key1']);
        });
      });
      testData.slice(2).forEach(data => {
        it(`should return full context on ${data.text}`, () => {
          // Act
          const res = schema.filterContext(data.value);

          // Assert
          expect(res.Keys).to.eql(['key1', 'key2']);
        });
      });
    });
  });

  describe('getMostRelevant', () => {
    describe('with no attributes in schema', () => {
      const contextSchema = new ContextSchema([]);
      it('should return single empty-context toggle given', () => {
        // Arrange
        const context = new Context({});
        const toggle = new Toggle(true, context);

        // Act
        const res = contextSchema.getMostRelevant([toggle]);

        // Assert
        expect(res).to.equal(toggle);
      });

      it('should throw when given single non-empty-context toggle', () => {
        // Arrange
        const key = 'key';
        const context = new Context({ [key]: 'value' });
        const toggle = new Toggle(true, context);

        // Act
        expect(() => {
          const res = contextSchema.getMostRelevant([toggle]);
        })
          // Assert
          .to.throw(new RegExp(`attribute.*${key}`));
      });
    });

    describe('with single attributes in schema', () => {
      const attributeId = 'key';
      const contextSchema = new ContextSchema([createAttribute(attributeId)]);
      it('should return single empty-context toggle given', () => {
        // Arrange
        const context = new Context({});
        const toggle = new Toggle(true, context);

        // Act
        const res = contextSchema.getMostRelevant([toggle]);

        // Assert
        expect(res).to.equal(toggle);
      });

      it('should return single non-empty-context toggle given with matching attribute', () => {
        // Arrange
        const context = new Context({ [attributeId]: 'value' });
        const toggle = new Toggle(true, context);

        // Act
        const res = contextSchema.getMostRelevant([toggle]);

        // Assert
        expect(res).to.equal(toggle);
      });

      it('should return non-empty-context toggle when given that and empty-context toggle', () => {
        // Arrange
        const context1 = new Context({});
        const context2 = new Context({ [attributeId]: 'value' });
        const toggle1 = new Toggle(true, context1);
        const toggle2 = new Toggle(true, context2);

        // Act
        const res = contextSchema.getMostRelevant([toggle2, toggle1]);

        // Assert
        expect(res).to.equal(toggle2);
      });
    });

    describe('with two attributes in schema', () => {
      const attributeId1 = 'key1';
      const attributeId2 = 'key2';
      const contextSchema = new ContextSchema([
        createAttribute(attributeId1),
        createAttribute(attributeId2)
      ]);
      it(// tslint:disable-next-line: max-line-length
      'should return first toggle attribute when given toggles with different attributes', () => {
        // Arrange
        const context1 = new Context({ [attributeId1]: 'value' });
        const context2 = new Context({ [attributeId2]: 'value' });
        const toggle1 = new Toggle(true, context1);
        const toggle2 = new Toggle(true, context2);

        // Act
        const res = contextSchema.getMostRelevant([toggle1, toggle2]);

        // Assert
        expect(res).to.equal(toggle1);
      });

      describe('with all four permutations of toggle contexts', () => {
        let contextEmpty: Context;
        let context1: Context;
        let context2: Context;
        let context12: Context;
        let toggleEmpty: Toggle;
        let toggle1: Toggle;
        let toggle2: Toggle;
        let toggle12: Toggle;
        beforeEach(() => {
          // Arrange
          contextEmpty = new Context({});
          context1 = new Context({ [attributeId1]: 'value' });
          context2 = new Context({ [attributeId2]: 'value' });
          context12 = new Context({
            [attributeId1]: 'value',
            [attributeId2]: 'value'
          });
          toggleEmpty = new Toggle(true, contextEmpty);
          toggle1 = new Toggle(true, context1);
          toggle2 = new Toggle(true, context2);
          toggle12 = new Toggle(true, context12);
        });
        [
          {
            msg: 'with double context first',
            data: () => [toggle12, toggleEmpty, toggle1, toggle2]
          },
          {
            msg: 'with empty context first',
            data: () => [toggleEmpty, toggle1, toggle2, toggle12]
          },
          {
            msg: 'with attribute 1 context first',
            data: () => [toggle1, toggle2, toggle12, toggleEmpty]
          },
          {
            msg: 'with attribute 2 context first',
            data: () => [toggle2, toggle12, toggleEmpty, toggle1]
          }
        ].forEach(element => {
          describe(element.msg, () => {
            it('should return toggle with both attributes when given all combination of toggle contexts', () => {
              // Act
              const res = contextSchema.getMostRelevant(element.data());

              // Assert
              expect(res).to.equal(element.data()[0]);
            });
          });
        });
      });
    });

    describe('with three attributes in schema', () => {
      const attributeId1 = 'key1';
      const attributeId2 = 'key2';
      const attributeId3 = 'key3';
      const contextSchema = new ContextSchema([
        createAttribute(attributeId1),
        createAttribute(attributeId2),
        createAttribute(attributeId3)
      ]);
      it(// tslint:disable-next-line: max-line-length
      'should return first toggle when given toggles with different attributes', () => {
        // Arrange
        const context12 = new Context({
          [attributeId1]: 'value',
          [attributeId2]: 'value'
        });
        const context3 = new Context({ [attributeId3]: 'value' });
        const toggle12 = new Toggle(true, context12);
        const toggle3 = new Toggle(true, context3);

        // Act
        const res = contextSchema.getMostRelevant([toggle3, toggle12]);

        // Assert
        expect(res).to.equal(toggle3);
      });
    });
  });
});

import { expect } from 'chai';
import * as fc from 'fast-check';
import { objectMap } from '../src/utility/ObjectHelpers';

const stringNoProto = () => fc.string().filter(x => x != '__proto__');

describe('ObjectHelper', () => {
  describe('objectMap', () => {
    it('should always be deep equal when using the unity function', () => {
      fc.assert(
        fc.property(
          fc.dictionary(stringNoProto(), fc.oneof(fc.string(), fc.integer(), fc.double(), fc.object())),
          (data) => {
            const res = objectMap(data, (x) => x);
            expect(res).to.be.deep.equal(data);
          }
        )
      );
    });
    it('should always have the same keys', () => {
      fc.assert(
        fc.property(
          fc.dictionary(stringNoProto(), fc.string()),
          fc.func(fc.string()),
          (data, mapper) => {
            const res = objectMap(data, mapper);
            expect(Object.keys(res)).to.have.all.members(Object.keys(data));
          }
        )
      );
    });
    it('should always be different when mapper appends', () => {
      fc.assert(
        fc.property(fc.dictionary(stringNoProto(), fc.string()), (data) => {
          const res = objectMap(data, (x) => x + '1');
          const joined = joinObjects(res, data);
          Object.keys(joined).map((key) => expect(joined[key].a).to.not.be.equal(joined[key].b));
        })
      );
    });
    it('should always be equal when double negating numbers', () => {
      fc.assert(
        fc.property(fc.dictionary(stringNoProto(), fc.double()), (data) => {
          const res = objectMap(
            objectMap(data, (x) => -x),
            (x) => -x
          );
          expect(res).to.be.deep.equal(data);
        })
      );
    });
    it('should never modify the input', () => {
      fc.assert(
        fc.property(
          fc.dictionary(stringNoProto(), fc.string()),
          fc.func(fc.string()),
          (data, mapper) => {
            const beforeData = { ...data };
            objectMap(data, mapper);
            expect(beforeData).to.be.deep.equal(data);
          }
        )
      );
    });
    it('should always throw when mapper throws and input contains keys', () => {
      fc.assert(
        fc.property(
          fc.dictionary(stringNoProto(), fc.string()).filter((data) => Object.keys(data).length > 0),
          (data) => {
            expect(() =>
              objectMap(data, (_) => {
                throw new Error('Match this!');
              })
            ).to.throw('Match this!');
          }
        )
      );
    });
    it('should call the mapper once for each key', () => {
      fc.assert(
        fc.property(
          fc.dictionary(stringNoProto(), fc.oneof(fc.string(), fc.integer(), fc.double(), fc.object())),
          (data) => {
            let counter = 0;
            objectMap(data, (_) => counter++);
            expect(counter).to.be.equal(Object.keys(data).length);
          }
        )
      );
    });
  });
});

const joinObjects = (a, b) =>
  Object.keys(a)
    .concat(Object.keys(b))
    .unique()
    .reduce((result, key) => {
      result[key] = { a: a[key], b: b[key] };
      return result;
    }, {});

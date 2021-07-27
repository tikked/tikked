import { Context } from '../../src/domain/Context';
import { ExactMatcher } from '../../src/domain/matchers/ExactMatcher';
import { expect } from 'chai';

describe('ExactMatcher', () => {
  describe('constructor', () => {
    it('should be implemented', () => {
      const toggle = new ExactMatcher(new Context({}));
    });
  });
  describe('getContext', () => {
    describe('with a specific context', () => {
      const context = new Context({});
      const matcher = new ExactMatcher(context);
      it('when accessed, should return the same context', () => {
        // Act
        const res = matcher.Context;

        // Assert
        expect(res).to.be.equal(context);
      });
    });
  });
  describe('matches', () => {
    [
      {
        contextText: 'with empty context',
        matcherContext: new Context({}),
        tests: [
          {
            text: 'when called with empty context should return true',
            context: new Context({}),
            expected: true
          },
          {
            text: 'when called with non-empty context should return false',
            context: new Context({ key: 'value' }),
            expected: false
          }
        ]
      },
      {
        contextText: 'with single-key context',
        matcherContext: new Context({ key: 'value' }),
        tests: [
          {
            text: 'when called with empty context should return false',
            context: new Context({}),
            expected: false
          },
          {
            text: 'when called with matching key-value context should return true',
            context: new Context({ key: 'value' }),
            expected: true
          },
          {
            // eslint-disable-next-line max-len
            text: 'when called with non-matching value in a single key-value context should return false',
            context: new Context({ key: 'value2' }),
            expected: false
          },
          {
            // eslint-disable-next-line max-len
            text: 'when called with non-matching key in a single key-value context should return false',
            context: new Context({ key2: 'value' }),
            expected: false
          },
          {
            // eslint-disable-next-line max-len
            text: 'when called with a dual-key context that has matching key-value plus non-matching key-value, should return false',
            context: new Context({ key: 'value', key2: 'value' }),
            expected: false
          }
        ]
      },
      {
        contextText: 'with dual-key context',
        matcherContext: new Context({ key: 'value', key2: 'value2' }),
        tests: [
          {
            text: 'when called with empty context should return false',
            context: new Context({}),
            expected: false
          },
          {
            // eslint-disable-next-line max-len
            text: 'when called with single-key context with one matching key-value should return false',
            context: new Context({ key: 'value' }),
            expected: false
          },
          {
            // eslint-disable-next-line max-len
            text: 'when called with dual-key context with one matching key-value and one non-matching should return false',
            context: new Context({ key: 'value', key2: 'value3' }),
            expected: false
          },
          {
            text: 'when called with a dual-key context that matches both, should return true',
            context: new Context({ key: 'value', key2: 'value2' }),
            expected: true
          },
          {
            // eslint-disable-next-line max-len
            text: 'when called with a tri-key context that matches both, but has extra key-value, should return false',
            context: new Context({ key: 'value', key2: 'value2', key3: 'value3' }),
            expected: false
          }
        ]
      }
    ].forEach(({ contextText, matcherContext, tests }) => {
      describe(contextText, () => {
        const matcher = new ExactMatcher(matcherContext);
        tests.forEach(({ text, context, expected }) => {
          it(text, () => {
            // Act
            const res = matcher.matches(context);

            // Assert
            expect(res).to.be.eql(expected);
          });
        });
      });
    });
  });
});

import { Context } from '../../src/domain/Context';
import { ExactMatcher } from '../../src/domain/matchers/ExactMatcher';
import { SupersetMatcher } from '../../src/domain/matchers/SupersetMatcher';
import { expect } from 'chai';

[ExactMatcher, SupersetMatcher].forEach(matcherCtor => {
  describe(matcherCtor.name, () => {
    describe('constructor', () => {
      it('should be implemented', () => {
        const matcher = new matcherCtor(new Context({}));
      });
    });
    describe('getContext', () => {
      describe('with a specific context', () => {
        const context = new Context({});
        const matcher = new matcherCtor(context);
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
              text: 'when called with empty context',
              context: new Context({}),
              expected: { ExactMatcher: true, SupersetMatcher: true }
            },
            {
              text: 'when called with non-empty context',
              context: new Context({ key: 'value' }),
              expected: { ExactMatcher: false, SupersetMatcher: true }
            }
          ]
        },
        {
          contextText: 'with single-key context',
          matcherContext: new Context({ key: 'value' }),
          tests: [
            {
              text: 'when called with empty context',
              context: new Context({}),
              expected: { ExactMatcher: false, SupersetMatcher: false }
            },
            {
              text: 'when called with matching key-value context',
              context: new Context({ key: 'value' }),
              expected: { ExactMatcher: true, SupersetMatcher: true }
            },
            {
              // eslint-disable-next-line max-len
              text:
                'when called with non-matching value in a single key-value context',
              context: new Context({ key: 'value2' }),
              expected: { ExactMatcher: false, SupersetMatcher: false }
            },
            {
              // eslint-disable-next-line max-len
              text:
                'when called with non-matching key in a single key-value context',
              context: new Context({ key2: 'value' }),
              expected: { ExactMatcher: false, SupersetMatcher: false }
            },
            {
              // eslint-disable-next-line max-len
              text:
                'when called with a dual-key context that has matching key-value plus non-matching key-value',
              context: new Context({ key: 'value', key2: 'value' }),
              expected: { ExactMatcher: false, SupersetMatcher: true }
            }
          ]
        },
        {
          contextText: 'with dual-key context',
          matcherContext: new Context({ key: 'value', key2: 'value2' }),
          tests: [
            {
              text: 'when called with empty context',
              context: new Context({}),
              expected: { ExactMatcher: false, SupersetMatcher: false }
            },
            {
              // eslint-disable-next-line max-len
              text:
                'when called with single-key context with one matching key-value',
              context: new Context({ key: 'value' }),
              expected: { ExactMatcher: false, SupersetMatcher: false }
            },
            {
              // eslint-disable-next-line max-len
              text:
                'when called with dual-key context with one matching key-value and one non-matching',
              context: new Context({ key: 'value', key2: 'value3' }),
              expected: { ExactMatcher: false, SupersetMatcher: false }
            },
            {
              text: 'when called with a dual-key context that matches both,',
              context: new Context({ key: 'value', key2: 'value2' }),
              expected: { ExactMatcher: true, SupersetMatcher: true }
            },
            {
              // eslint-disable-next-line max-len
              text:
                'when called with a tri-key context that matches both, but has extra key-value',
              context: new Context({ key: 'value', key2: 'value2', key3: 'value3' }),
              expected: { ExactMatcher: false, SupersetMatcher: true }
            }
          ]
        }
      ].forEach(({ contextText, matcherContext, tests }) => {
        describe(contextText, () => {
          const matcher = new matcherCtor(matcherContext);
          tests.forEach(({ text, context, expected }) => {
            it(text + ', should return ' + expected[matcherCtor.name], () => {
              // Act
              const res = matcher.matches(context);

              // Assert
              expect(res).to.be.eql(expected[matcherCtor.name]);
            });
          });
        });
      });
    });
  });
});

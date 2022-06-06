import { injectable } from 'inversify';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';
import {
  ApplicationEnvironment,
  Attribute,
  Context,
  ContextSchema,
  FeatureFlag,
  SupersetMatcher,
  RegexMatcher,
  ExactMatcher,
  LogicalAndMatcher,
  Toggle,
  LogicalOrMatcher,
  LogicalNotMatcher,
  Matcher,
  ContextMatcher
} from '@tikked/core';
import { Decoder, Encoder } from '.';

type UnmappedMatcherContext = { [key: string]: string };

type UnmappedMatcher = {
  [matcher: string]: UnmappedMatcherContext | UnmappedMatcher[] | UnmappedMatcher;
};

@injectable()
export class JsonCoder implements Encoder<string>, Decoder<string> {
  private static idNameDesc = {
    id: t.string,
    name: t.string,
    description: t.string
  };

  private static contextDecoder = t.record(t.string, t.string);

  private static matcherDecoder: t.Type<UnmappedMatcher> = t.recursion('Matcher', () =>
    t.record(
      t.string,
      t.union([
        JsonCoder.contextDecoder,
        t.array(JsonCoder.matcherDecoder),
        JsonCoder.matcherDecoder
      ])
    )
  );

  private static toggleDecoder = t.type({
    isActive: t.boolean,
    matcher: JsonCoder.matcherDecoder
  });

  private static featureFlagDecoder = t.type({
    ...JsonCoder.idNameDesc,
    toggles: t.array(JsonCoder.toggleDecoder)
  });

  private static attributeDecoder = t.type({
    ...JsonCoder.idNameDesc
  });

  private static contextSchemaDecoder = t.type({
    attributes: t.array(JsonCoder.attributeDecoder)
  });

  private static applicationEnvironmentDecoder = t.type({
    ...JsonCoder.idNameDesc,
    featureFlags: t.array(JsonCoder.featureFlagDecoder),
    contextSchema: JsonCoder.contextSchemaDecoder
  });

  public decode(input: string): ApplicationEnvironment {
    const parsed = JSON.parse(input);
    const decoded = JsonCoder.applicationEnvironmentDecoder.decode(parsed);
    const res = decoded.fold(
      (errors) => {
        const messages = reporter(decoded);
        throw new Error(messages.join('\n'));
      },
      (value) => value
    );
    return new ApplicationEnvironment(
      res.id,
      res.name,
      res.description,
      new ContextSchema(
        res.contextSchema.attributes.map(
          (attr) => new Attribute(attr.id, attr.name, attr.description)
        )
      ),
      res.featureFlags.map(
        (ff) =>
          new FeatureFlag(
            ff.id,
            ff.name,
            ff.description,
            ff.toggles.map((tog) => new Toggle(tog.isActive, decodeMatcher(tog.matcher)))
          )
      )
    );
  }

  public encode(appEnv: ApplicationEnvironment): string {
    const mappedEnvironment = {
      ...appEnv,
      featureFlags: appEnv.FeatureFlags?.map((featureFlag) => ({
        ...featureFlag,
        toggles: featureFlag.Toggles?.map((toggle) => ({
          ...toggle,
          matcher: encodeMatcher(toggle.Matcher)
        }))
      }))
    };

    return JSON.stringify(mappedEnvironment);
  }
}

const encodeMatcher = (matcher: Matcher) => {
  switch (matcher.$type) {
    case '$superset':
    case '$exact':
    case '$regex':
      return {
        [matcher.$type]: (matcher as ContextMatcher).Context
      };
    case '$and':
      return {
        $and: (matcher as LogicalAndMatcher).Matchers.map(encodeMatcher)
      };
    case '$or':
      return {
        $or: (matcher as LogicalOrMatcher).Matchers.map(encodeMatcher)
      };
    case '$not':
      return {
        $not: encodeMatcher((matcher as LogicalNotMatcher).Matcher)
      };
    default:
      throw new Error(`Unknown matcher type: ${matcher.$type}`);
  }
};

const decodeMatcher = (matcher: UnmappedMatcher) => {
  const entries = Object.entries(matcher);

  const matcherFactory = {
    $superset: (context: UnmappedMatcherContext) => new SupersetMatcher(new Context(context)),
    $exact: (context: UnmappedMatcherContext) => new ExactMatcher(new Context(context)),
    $regex: (context: UnmappedMatcherContext) => new RegexMatcher(new Context(context)),
    $and: (matchers: UnmappedMatcher[]) => new LogicalAndMatcher(matchers.map(decodeMatcher)),
    $or: (matchers: UnmappedMatcher[]) => new LogicalOrMatcher(matchers.map(decodeMatcher)),
    $not: (matcher: UnmappedMatcher) => new LogicalNotMatcher(decodeMatcher(matcher))
  };

  const mappedMatchers = entries.map(([key, context]) => matcherFactory[key](context));

  if (mappedMatchers.length > 1) {
    throw new Error('Ambiguous matchers. You may only have one matcher per toggle.');
  }

  if (mappedMatchers.length === 1) {
    return mappedMatchers[0];
  }

  throw new Error(`Unknown matcher type(s): ${Object.keys(matcher).join(', ')}`);
};

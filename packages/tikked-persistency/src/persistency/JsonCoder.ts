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
  Toggle
} from 'tikked-core';
import { Decoder, Encoder } from '.';

@injectable()
export class JsonCoder implements Encoder<string>, Decoder<string> {
  private static idNameDesc = {
    id: t.string,
    name: t.string,
    description: t.string
  };

  private static contextDecoder = t.record(t.string, t.string);

  private static matcherDecoder = t.type({
    $type: t.string,
    context: JsonCoder.contextDecoder
  });

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
      errors => {
        const messages = reporter(decoded);
        throw new Error(messages.join('\n'));
      },
      value => value
    );
    return new ApplicationEnvironment(
      res.id,
      res.name,
      res.description,
      new ContextSchema(
        res.contextSchema.attributes.map(
          attr => new Attribute(attr.id, attr.name, attr.description)
        )
      ),
      res.featureFlags.map(
        ff =>
          new FeatureFlag(
            ff.id,
            ff.name,
            ff.description,
            ff.toggles.map(tog => new Toggle(tog.isActive, mapMatcher(tog.matcher)))
          )
      )
    );
  }

  public encode(appEnv: ApplicationEnvironment): string {
    return JSON.stringify(appEnv);
  }
}

const mapMatcher = (matcher: { $type: string; context: { [x: string]: string } }) => {
  switch (matcher.$type) {
    case 'superset':
      return new SupersetMatcher(new Context(matcher.context));
    case 'exact':
      return new ExactMatcher(new Context(matcher.context));
      case 'regex':
        return new RegexMatcher(new Context(matcher.context));
    default:
      throw new Error(`Unknown matcher type: ${matcher.$type}`);
  }
};

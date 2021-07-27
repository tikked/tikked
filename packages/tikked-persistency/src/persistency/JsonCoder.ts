import { injectable } from 'inversify';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';
import {
  ApplicationEnvironment,
  Attribute,
  Context,
  ContextSchema,
  FeatureFlag,
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

  private static toggleDecoder = t.type({
    isActive: t.boolean,
    context: JsonCoder.contextDecoder
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
          attr =>
            new Attribute(attr.id, attr.name, attr.description)
        )
      ),
      res.featureFlags.map(
        ff =>
          new FeatureFlag(
            ff.id,
            ff.name,
            ff.description,
            ff.toggles.map(
              tog => new Toggle(tog.isActive, new Context(tog.context))
            )
          )
      )
    );
  }

  public encode(appEnv: ApplicationEnvironment): string {
    return JSON.stringify(appEnv);
  }
}

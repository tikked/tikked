import '../utility/ArrayExtensions';
import { validateUniqueIds } from '../utility/Validators';
import { Attribute } from './Attribute';
import { Context } from './Context';
import { Toggle } from './Toggle';

export class ContextSchema {
  private attributes: Attribute[];

  public constructor(attributes: Attribute[]) {
    validateUniqueIds(attributes);

    this.attributes = [...attributes];
  }

  public get Attributes(): readonly Attribute[] {
    return this.attributes;
  }

  /**
   * Finds the most relevant toggle based on their keys and the order of the attributes in
   * this schema
   * @param toggles The pool of toggles to find the most relevant from
   * @throws {Error} If any input toggle has attributes unknown to this schema.
   * Call {@link SchemaContext#filterContext} on this schema before to filter out the unwanted
   * attributes
   */
  public getMostRelevant(toggles: Toggle[]): Toggle {
    return toggles[0];
  }

  /**
   * Filters out non-existent attributes from the provided context and returns a new context,
   * which obey this schema
   * @param context The context to be filtered
   */
  public filterContext(context: Context): Context {
    return new Context(
      context.Keys.filter((key) => this.attributes.some((attr) => attr.Id === key)).reduce(
        (accu, curr) => ({ ...accu, [curr]: context.get(curr) }),
        {}
      )
    );
  }
}

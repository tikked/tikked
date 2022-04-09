import { Context } from '../Context';
import { ContextMatcher } from './Matcher';

export class ExactMatcher implements ContextMatcher {
  private $type = 'exact';
  public constructor(private context: Context) {}

  public get Context() {
    return this.context;
  }

  /**
   * Determines whether the provided context is exactly equal to the internal one of this matcher
   * @param context The context that is to be matched
   */
  public matches(context: Context): boolean {
    return (
      this.context.Keys.length === context.Keys.length &&
      this.context.Keys.every(
        key => context.hasKey(key) && this.context.matchKeyValue(key, context.get(key))
      )
    );
  }
}

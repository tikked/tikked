import { Context } from '../Context';
import { Matcher } from './Matcher';

export class LogicalNotMatcher implements Matcher {
  public readonly $type = '$not';
  public constructor(private matcher: Matcher) {}

  public get Matcher() {
    return this.matcher;
  }

  /**
   * Determines whether the provided context does not match the provided matcher
   * @param context The context that is to be matched
   */
  public matches(context: Context): boolean {
    return !this.matcher.matches(context);
  }
}

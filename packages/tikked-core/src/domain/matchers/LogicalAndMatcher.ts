import { Context } from '../Context';
import { Matcher } from './Matcher';

export class LogicalAndMatcher implements Matcher {
  public readonly $type = '$and';
  public constructor(private matchers: Matcher[]) {}

  public get Matchers() {
    return this.matchers;
  }

  /**
   * Determines whether the provided context matches all provided matchers
   * @param context The context that is to be matched
   */
  public matches(context: Context): boolean {
    return this.matchers.every((matcher: Matcher) => matcher.matches(context));
  }
}

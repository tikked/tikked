import { Context } from '../Context';
import { Matcher } from './Matcher';

export class LogicalOrMatcher implements Matcher {
  public readonly $type = '$or';
  public constructor(private matchers: Matcher[]) {}

  public get Matchers() {
    return this.matchers;
  }
  
  /**
   * Determines whether the provided context matches any of the provided matchers
   * @param context The context that is to be matched
   */
  public matches(context: Context): boolean {
    return this.matchers.some((matcher: Matcher) => matcher.matches(context));
  }
}

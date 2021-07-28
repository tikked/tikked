import { Context } from './Context';
import { Matcher } from './matchers/Matcher';
import { SupersetMatcher } from './matchers/SupersetMatcher';

export class Toggle {
  private matcher: Matcher;
  public constructor(private isActive: boolean, context: Context) {
    this.matcher = new SupersetMatcher(context);
  }

  public get IsActive() {
    return this.isActive;
  }

  /**
   * Determines whether the provided context is equal to or more specific than the
   * internal one of this toggle
   * @param context The context that is matched with this toggle
   */
  public matches(context: Context): boolean {
    return this.matcher.matches(context);
  }
}

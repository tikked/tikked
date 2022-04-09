import { Context } from './Context';
import { Matcher } from './matchers/Matcher';

export class Toggle {
  public constructor(private isActive: boolean, private matcher: Matcher) {}

  public get IsActive() {
    return this.isActive;
  }

  public get Matcher() {
    return this.matcher;
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

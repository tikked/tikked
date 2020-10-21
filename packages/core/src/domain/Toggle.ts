import { Context } from './Context';

export class Toggle {
  public constructor(private isActive: boolean, private context: Context) {}

  public get IsActive() {
    return this.isActive;
  }

  public get Context() {
    return this.context;
  }

  /**
   * Determines whether the provided context is equal to or more specific than the
   * internal one of this toggle
   * @param context The context that is matched with this toggle
   */
  public matches(context: Context): boolean {
    return this.context.Keys.every(
      key => context.hasKey(key) && this.context.get(key) === context.get(key)
    );
  }
}

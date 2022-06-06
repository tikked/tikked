import { Context } from '../Context';

export interface Matcher {
  readonly $type: string;

  matches(context: Context): boolean;
}
export interface ContextMatcher extends Matcher {
  readonly Context: Context;
}

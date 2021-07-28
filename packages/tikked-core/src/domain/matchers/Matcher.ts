import { Context } from '../Context';

export interface Matcher {
  matches(context: Context): boolean;
}
export interface ContextMatcher extends Matcher {
  readonly Context: Context;
}

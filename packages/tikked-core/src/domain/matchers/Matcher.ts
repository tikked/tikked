import { Context } from '../Context';

export interface Matcher {
  matches(context: Context): boolean;
}

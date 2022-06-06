import { objectMap } from '../../utility/ObjectHelpers';
import { Context } from '../Context';
import { ContextMatcher } from './Matcher';

export class RegexMatcher implements ContextMatcher {
  public readonly $type = '$regex';
  private regexMap: RegexMap;
  public constructor(private readonly context: Context) {
    this.regexMap = objectMap(context.toJSON(), (str) => new RegExp(str));
  }

  public get Context() {
    return this.context;
  }

  /**
   * Determines whether the provided context is matches the internal one of this matcher when each entry local is considered as a regex
   * @param context The context that is to be matched
   */
  public matches(context: Context): boolean {
    return Object.keys(this.regexMap).every(
      (key) =>
        context.hasKey(key) &&
        this.regexMap.hasOwnProperty(key) &&
        this.regexMap[key].test(context.get(key))
    );
  }
}

interface RegexMap {
  [key: string]: RegExp;
}

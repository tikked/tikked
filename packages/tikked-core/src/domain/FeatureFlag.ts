import { validateIsNotEmpty } from '../utility/Validators';
import { Context } from './Context';
import { Identifiable } from './Identifiable';
import { Toggle } from './Toggle';

export class FeatureFlag implements Identifiable {
  private toggles: Toggle[];

  public constructor(
    private id: string,
    private name: string,
    private description: string,
    toggles: Toggle[]
  ) {
    validateIsNotEmpty(id, 'Id should be non-empty');
    this.validateToggles(toggles);

    this.toggles = [...toggles];
  }

  public get Id() {
    return this.id;
  }

  public get Name() {
    return this.name;
  }

  public get Description() {
    return this.description;
  }

  public get Toggles() {
    return this.toggles;
  }

  /**
   * Gets the toggles that match with the provided context
   * @param context The context for which to fetch toggles
   */
  public getToggles(context: Context) {
    return this.toggles.filter(tog => tog.matches(context));
  }

  private validateToggles(toggles: Toggle[]) {
    validateIsNotEmpty(toggles, 'Toggles should be non-empty');
  }
}

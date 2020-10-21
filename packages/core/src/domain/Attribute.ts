import { Identifiable } from './Identifiable';

export class Attribute implements Identifiable {
  public constructor(private id: string, private name: string, private description: string) {}

  public get Id() {
    return this.id;
  }

  public get Name() {
    return this.name;
  }

  public get Description() {
    return this.description;
  }
}

export class Context {
  private contextData: ContextData;

  public constructor(contextData: ContextData) {
    this.contextData = { ...contextData };
  }

  public get(key: string): string {
    if (!this.hasKey(key)) {
      throw new Error(`Key "${key}" not found`);
    }
    return this.contextData[key];
  }

  public hasKey(key: string): boolean {
    return this.contextData.hasOwnProperty(key);
  }

  public get Keys(): readonly string[] {
    return Object.keys(this.contextData);
  }

  public toJSON(): ContextData {
    return this.contextData;
  }

  public matchKeyValue(key: string, value: string): boolean {
    return this.hasKey(key) && this.get(key) === value;
  }
}

interface ContextData {
  [key: string]: string;
}

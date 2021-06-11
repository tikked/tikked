import { clearInterval } from 'timers';
import { ApplicationEnvironment } from '../src/domain/ApplicationEnvironment';
import { Attribute } from '../src/domain/Attribute';
import { Context } from '../src/domain/Context';
import { ContextSchema } from '../src/domain/ContextSchema';
import { FeatureFlag } from '../src/domain/FeatureFlag';
import { Toggle } from '../src/domain/Toggle';

export const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const becomesTrue = (condition: () => boolean, frequencyMs = 10, timeoutMs = 1000) => {
  let interval;
  return Promise.race<unknown>([
    new Promise(resolve => {
      interval = setInterval(() => {
        if (condition()) {
          resolve();
        }
      }, frequencyMs);
    }),
    timeout(timeoutMs).then(() => {
      clearInterval(interval);
      throw new Error(`Timout while waiting for condition to be true ${condition}`);
    })
  ]);
};

export const createFeatureFlag = (id?: string) =>
  new FeatureFlag(id || createId(), createName(), createDescription(), [createToggle()]);

export const createToggle = () => new Toggle(true, createContext());

export const createContext = () => new Context({});

let idCounter = 1;
export const createId = () => 'some_id' + idCounter++;

let nameCounter = 1;
export const createName = () => 'some_name' + nameCounter++;

let stringCounter = 1;
export const createString = () => 'some_string' + stringCounter++;

let descriptionCounter = 1;
export const createDescription = () => 'some_desc' + descriptionCounter++;

export const createAttribute = (id?: string) =>
  new Attribute(id || createId(), createName(), createDescription());

export const createContextSchema = (attrs: Attribute[] = []) => new ContextSchema(attrs);

export const createApplicationEnvironment = (id?: string) =>
  new ApplicationEnvironment(
    id || createId(),
    createName(),
    createDescription(),
    createContextSchema(),
    []
  );

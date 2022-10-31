import { ApplicationEnvironment, ContextData } from '@tikked/core';

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type NonFunctionProperties<T> = {[P in NonFunctionPropertyNames<T>] : T[P] extends number | string ? T[P]:NonFunctionProperties<T[P]> };

export enum Mode {
  featureSet = 'featureSet',
  applicationEnvironment = 'applicationEnvironment'
}

export type TikkedServerMessage =
  | {
      type: 'featureSet';
      payload: string[];
    }
  | {
      type: 'applicationEnvironment';
      payload: NonFunctionProperties<ApplicationEnvironment>;
    }
  | {
      type: 'mode';
      payload: Mode;
    };

export type TikkedClientMessage =
  | {
      type: 'changeMode';
      payload: Mode;
    }
  | {
      type: 'context';
      payload: ContextData;
    };


export const isValidClientMessage = (msg: any): msg is TikkedClientMessage =>
    (msg?.type === 'changeMode' && Object.values(Mode).includes(msg?.payload)) ||
    (msg?.type === 'context' && typeof msg?.payload === 'object');
  
export const isValidServerMessage = (msg: any): msg is TikkedServerMessage =>
    (msg?.type === 'featureSet' && typeof msg?.payload === 'object') ||
    (msg?.type === 'applicationEnvironment' && typeof msg?.payload === 'object') ||
    (msg?.type === 'mode' && Object.values(Mode).includes(msg?.payload));

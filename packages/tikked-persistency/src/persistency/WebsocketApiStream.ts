import { Observable } from 'rxjs';
import { map, filter, distinctUntilChanged, retry, shareReplay } from 'rxjs/operators';
import { ApplicationEnvironment, validateIsNotEmpty } from '@tikked/core';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { DataStream } from '.';
import { Mode, NonFunctionProperties, isValidServerMessage } from './WebsocketInterface';
import * as WebSocket from 'ws';

export class WebsocketApiStream implements DataStream {
  private obs: Observable<string>;

  /**
   * Creates a Websocket API stream. Use @member read to start observing the content.
   * @param url The path to the websocket endpoint that hosts the Application Environment
   */
  public constructor(
    private url: string,
    private webSocketCtor: WebSocketSubjectConfig<unknown>['WebSocketCtor'] = WebSocket as any
  ) {
    validateIsWSUrl(url);
  }

  public write(content: string): Promise<void> {
    return Promise.reject();
  }

  public read(): Observable<string> {
    return this.getApplicationEnvironment();
  }

  private getApplicationEnvironment(): Observable<string> {
    if (!this.obs) {
      const subject = webSocket({ url: this.url, WebSocketCtor: this.webSocketCtor });
      this.obs = subject.pipe(
        map((x) => {
          if (isValidServerMessage(x)) {
            switch (x.type) {
              case 'mode':
                respondToMode(x.payload, subject);
                return;
              case 'featureSet':
                return;
              case 'applicationEnvironment':
                return JSON.stringify(x.payload);
            }
          }
          return;
        }),
        filter<string | undefined, string>(isString),
        distinctUntilChanged()
      );
    }
    return this.obs;
  }
}

const isString = (str?: any): str is string => typeof str === 'string';

const wSUrlRegex = /^wss?:\/\/[^\s/$.?#].[^\s]*$/i;
const validateIsWSUrl = (url: string) => {
  validateIsNotEmpty(url);
  if (!wSUrlRegex.test(url)) {
    throw new Error(`String is not a valid websocket URL: "${url}"`);
  }
};
function respondToMode(payload: Mode, subject: WebSocketSubject<unknown>) {
  switch (payload) {
    case Mode.featureSet:
      subject.next({ type: 'changeMode', payload: 'applicationEnvironment' });
      break;
    case Mode.applicationEnvironment:
      break;
    default:
      subject.next({ type: 'changeMode', payload: 'applicationEnvironment' });
      break;
  }
}

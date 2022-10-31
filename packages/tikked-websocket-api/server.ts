import 'reflect-metadata';
import { combineLatest, Observable } from 'rxjs';
import { Context } from '@tikked/core/dist/src/domain';
import { ApplicationEnvironmentRepository, Coder, isValidClientMessage, Mode, TYPES } from '@tikked/persistency';
import * as WebSocket from 'ws';
import { Server } from 'ws';
import { createContainer } from './inversify.config';

const wss = new Server({ port: 8080 });
const container = createContainer('../../samples/');
const repo = container.get<ApplicationEnvironmentRepository>(ApplicationEnvironmentRepository);
const coder = container.get<Coder>(TYPES.Coder);

wss.on('connection', function connection(ws, req) {
  if (!req.url) {
    ws.close();
    return;
  }
  let mode: Mode = Mode.featureSet;
  try {
    const applicationEnvironment = req.url?.substring(1);

    const sub = combineLatest([repo.get(applicationEnvironment), observeSocket(ws)]).subscribe({
      next: ([appEnv, context]) => {
        switch (mode) {
          case Mode.applicationEnvironment:
            ws.send(`{"type":"applicationEnvironment","payload":${coder.encode(appEnv)}}`);
            break;
          case Mode.featureSet:
            const featureSet = appEnv.getFeatureSet(context);
            ws.send(JSON.stringify({ type: 'featureSet', payload: new Array(...featureSet) }));
            break;
        }
      },
      error: (e) => {
        console.error(e);
        ws.close();
      }
    });
    ws.on('close', () => sub.unsubscribe());
  } catch (e) {
    console.error(e);
    ws.close();
  }

  function observeSocket(ws: WebSocket): Observable<Context> {
    return new Observable<Context>((observer) => {
      ws.on('message', function message(data) {
        try {
          const message = JSON.parse(data.toString());
          if (isValidClientMessage(message)) {
            switch (message.type) {
              case 'context':
                observer.next(new Context(message.payload));
                break;
              case 'changeMode':
                mode = message.payload;
                observer.next(new Context({}));
                break;
            }
          }
        } catch (e) {
          observer.error(e);
        }
      });
    });
  }
});

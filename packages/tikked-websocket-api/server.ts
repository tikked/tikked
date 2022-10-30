import 'reflect-metadata';
import { combineLatest, Observable } from 'rxjs';
import { Context } from '@tikked/core/dist/src/domain';
import { ApplicationEnvironmentRepository } from '@tikked/persistency';
import * as WebSocket from 'ws';
import { Server } from 'ws';
import { createContainer } from './inversify.config';

const wss = new Server({ port: 8080 });
const container = createContainer('../../samples/');
const repo = container.get<ApplicationEnvironmentRepository>(ApplicationEnvironmentRepository);

wss.on('connection', function connection(ws, req) {
  if (!req.url) {
    ws.close();
    return;
  }
  try {
    const applicationEnvironment = req.url?.substring(1);

    const sub = combineLatest([repo.get(applicationEnvironment), observeSocket(ws)]).subscribe({
      next: ([appEnv, context]) => {
        const featureSet = appEnv.getFeatureSet(context);
        ws.send(JSON.stringify(new Array(...featureSet)));
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
});

function observeSocket(ws: WebSocket): Observable<Context> {
  return new Observable<Context>((observer) => {
    ws.on('message', function message(data) {
      try {
        const message = JSON.parse(data.toString());
        switch (message.type) {
          case 'context':
            observer.next(new Context(message.payload));
            break;
          default:
            console.error(`Unknown message type: ${message.type}`);
        }
      } catch (e) {
        observer.error(e);
      }
    });
  });
}

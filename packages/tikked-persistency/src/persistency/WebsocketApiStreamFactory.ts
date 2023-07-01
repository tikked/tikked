import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { Coder, StreamFactory, WebsocketApiStream } from '.';

@injectable()
export class WebsocketApiStreamFactory implements StreamFactory<WebsocketApiStream> {
  public constructor(@inject(TYPES.ApplicationEnvironmentRootWSUrl) private rootWSUrl = '') {}

  public create(applicationEnvironmentId: string): WebsocketApiStream {
    return new WebsocketApiStream(`${this.rootWSUrl}/${applicationEnvironmentId}`);
  }
}

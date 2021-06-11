import * as path from 'path';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { RestApiStream } from './RestApiStream';
import { StreamFactory } from '.';

@injectable()
export class RestApiStreamFactory implements StreamFactory<RestApiStream> {
  public constructor(@inject(TYPES.ApplicationEnvironmentRootUrl) private rootUrl = '') {}

  public create(applicationEnvironmentId: string): RestApiStream {
    return new RestApiStream(`${this.rootUrl}/application-environment/${applicationEnvironmentId}`);
  }
}

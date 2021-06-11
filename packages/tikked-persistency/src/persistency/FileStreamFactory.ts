import * as path from 'path';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { FileStream } from './FileStream';
import { StreamFactory } from '.';

@injectable()
export class FileStreamFactory implements StreamFactory<FileStream> {
  public constructor(@inject(TYPES.ApplicationEnvironmentRoot) private root = '') {}

  public create(applicationEnvironmentId: string): FileStream {
    return new FileStream(
      path.join(this.root, `${applicationEnvironmentId}.json`)
    );
  }
}

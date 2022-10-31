import { Observable } from 'rxjs';
import { ApplicationEnvironment } from '@tikked/core';

export interface Encoder<T> {
  encode(appEnv: ApplicationEnvironment): T;
}

export interface Decoder<T> {
  decode(input: T): ApplicationEnvironment;
}

export interface Coder<T = string> extends Decoder<T>, Encoder<T> {}

/**
 * A stream of data, that can be written and read
 */
export interface DataStream<TData = string> {
  /**
   * Get observable of the data stream, that triggers when the underlying source is updated
   */
  read(): Observable<TData>;
  /**
   * Write data back to the underlying source
   * @param content The data written to the underlying source
   */
  write(content: TData): Promise<void>;
}

export interface StreamFactory<TStream extends DataStream = DataStream> {
  /**
   * Creates a stream for a particular Application Environment
   * @param applicationEnvironmentId The id of the Application Environment to be streamed
   * @throws {Error} If it is not possible to create a stream for the given Application
   * Environment
   */
  create(applicationEnvironmentId: string): TStream;
}

export * from './ApplicationEnvironmentRepository';
export * from './JsonCoder';
export * from './FileStreamFactory';
export * from './RestApiStreamFactory';
export * from './WebsocketInterface';
export * from './WebsocketApiStream';
export * from './WebsocketApiStreamFactory';

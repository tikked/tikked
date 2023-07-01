import { Container } from 'inversify';
import { ApplicationEnvironmentRepository, Coder, StreamFactory, FileStreamFactory, JsonCoder, TYPES, RestApiStreamFactory,WebsocketApiStreamFactory, errorHandler } from '@tikked/persistency';

export function createContainer(applicationEnvironmentRoot: string): Container {
  const container = new Container();
  container
    .bind<ApplicationEnvironmentRepository>(ApplicationEnvironmentRepository)
    .toSelf()
    .inSingletonScope();
  container.bind<StreamFactory>(TYPES.StreamFactory).to(FileStreamFactory);
  container.bind<Coder>(TYPES.Coder).to(JsonCoder);
  container
    .bind<string>(TYPES.ApplicationEnvironmentRoot)
    .toConstantValue(applicationEnvironmentRoot);
  container
    .bind<errorHandler>(TYPES.ErrorHandler)
    .toConstantValue(console.error);
  return container;
}

export function createContainerRest(applicationEnvironmentRoot: string): Container {
  const container = new Container();
  container
    .bind<ApplicationEnvironmentRepository>(ApplicationEnvironmentRepository)
    .toSelf()
    .inSingletonScope();
  container.bind<StreamFactory>(TYPES.StreamFactory).to(RestApiStreamFactory);
  container.bind<Coder>(TYPES.Coder).to(JsonCoder);
  container
    .bind<string>(TYPES.ApplicationEnvironmentRootUrl)
    .toConstantValue(applicationEnvironmentRoot);
  container
    .bind<errorHandler>(TYPES.ErrorHandler)
    .toConstantValue(console.error);
  return container;
}

export function createContainerWebsocket(applicationEnvironmentRoot: string): Container {
  const container = new Container();
  container
    .bind<ApplicationEnvironmentRepository>(ApplicationEnvironmentRepository)
    .toSelf()
    .inSingletonScope();
  container.bind<StreamFactory>(TYPES.StreamFactory).to(WebsocketApiStreamFactory);
  container.bind<Coder>(TYPES.Coder).to(JsonCoder);
  container
    .bind<string>(TYPES.ApplicationEnvironmentRootWSUrl)
    .toConstantValue(applicationEnvironmentRoot);
  container
    .bind<errorHandler>(TYPES.ErrorHandler)
    .toConstantValue(console.error);
  return container;
}

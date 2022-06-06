import { Container } from 'inversify';
import { ApplicationEnvironmentRepository, Coder, StreamFactory, FileStreamFactory, JsonCoder, TYPES, RestApiStreamFactory, errorHandler } from 'tikked-persistency';

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

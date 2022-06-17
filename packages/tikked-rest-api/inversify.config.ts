import {
    ApplicationEnvironmentRepository,
    Coder,
    errorHandler,
    FileStreamFactory,
    JsonCoder,
    StreamFactory,
    TYPES
} from '@tikked/persistency';
import { Container } from 'inversify';
import { join } from 'path';

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
        .toConstantValue(join(__dirname, applicationEnvironmentRoot));
    container.bind<errorHandler>(TYPES.ErrorHandler).toConstantValue(console.error);
    return container;
}

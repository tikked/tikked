// Must be imported first
// tslint:disable-next-line: ordered-imports
import 'reflect-metadata';
import {json, urlencoded} from 'body-parser';
import * as cors from 'cors';
import { InversifyExpressServer } from 'inversify-express-utils';
import { createContainer } from './inversify.config';

// declare metadata by @controller annotation
import './src/controllers/ApplicationEnvironmentController';

export function createApp(applicationEnvironmentRoot: string) {
    const container = createContainer(applicationEnvironmentRoot);

    const server = new InversifyExpressServer(container);
    server.setConfig(app => {
        app.use(
            urlencoded({
                extended: true
            })
        );
        app.use(json());
        app.use(cors());
    });

    return server.build();
}

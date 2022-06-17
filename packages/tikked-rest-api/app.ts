// Must be imported first
// tslint:disable-next-line: ordered-imports
import 'reflect-metadata';
import {json, urlencoded} from 'body-parser';
import * as cors from 'cors';
import { InversifyExpressServer } from 'inversify-express-utils';
import { createContainer } from './inversify.config';

// declare metadata by @controller annotation
import './src/controllers/ApplicationEnvironmentController';

const container = createContainer('../../samples');

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

export const application = server.build();

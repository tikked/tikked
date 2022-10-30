const start = Date.now();
// tslint:disable-next-line: ordered-imports
import { createServer } from 'http'

import { createApp } from './app';
export const server = createServer(createApp('../../samples'));
server.listen(3000, () => {
    console.log(`Server started in ${Date.now() - start} millies`);
});

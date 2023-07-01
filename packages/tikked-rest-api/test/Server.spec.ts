import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
import { createApp } from '../app';
import { expect } from 'chai';

describe('Application', () => {
  let application;
  before(() => {
    application = createApp('../../samples/');
  });
  it('GET ApplicationEnvironment', async () => {
    const response = await chai.request(application).get('/application-environment/ps').send();
    expect(response.status).to.equal(200);
  });
});

import * as chaiModule from "chai";
import chaiHttp from 'chai-http';
const chai = chaiModule.use(chaiHttp);
import { createApp } from '../app';
import { expect } from 'chai';

describe('Application', () => {
  let application;
  before(() => {
    application = createApp('../../samples/');
  });
  it('GET ApplicationEnvironment', async () => {
    const response = await chai.request.execute(application).get('/application-environment/ps').send();
    expect(response.status).to.equal(200);
  });
});

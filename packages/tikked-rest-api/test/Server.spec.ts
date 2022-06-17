import * as chai from 'chai';
import {expect} from 'chai';
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
import {application} from '../app';

describe('Application', () => {
  it('GET ApplicationEnvironment', async () => {
    const response = await chai.request(application).get('/application-environment/ps').send();
    expect(response.status).to.equal(200);
  });
});

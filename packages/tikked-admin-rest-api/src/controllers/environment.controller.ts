import { Request, Response } from 'express';
import { readFileSync, readdirSync, writeFileSync, unlinkSync } from 'fs';

export class EnvironmentController {
  getAll = (request: Request, response: Response) => {
    response.send(
      readdirSync("../../samples")
      .map(x => ({ 
        id: x.replace('.json', ''),
        href: `http://localhost:4322/nest/${x.replace('.json', '')}`
      })));
  }
  getOne = (request: Request, response: Response) => {
    response.send(JSON.parse(readFileSync(`../../samples/${request.params.envId ?? request.body.id}.json`).toString()));
  }
  createOne = (request: Request, response: Response) => {
    writeFileSync(`../../samples/${request.body.id}.json`, JSON.stringify(request.body));
    return this.getOne(request, response);
  }
  updateOne = (request: Request, response: Response) => {
    writeFileSync(`../../samples/${request.params.envId}.json`,JSON.stringify(request.body))
    return this.getOne(request, response);
  }
  deleteOne = (request: Request, response: Response) => {
    unlinkSync(`../../samples/${request.params.envId}.json`);
    response.send();
  }
}

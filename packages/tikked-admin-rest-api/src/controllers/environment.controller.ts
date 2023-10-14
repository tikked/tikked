import { Request, Response } from 'express';
import { readFileSync, readdirSync, writeFileSync, unlinkSync } from 'fs';

export class EnvironmentController {
  getAll(request: Request, response: Response) {
    response.status(200).send(
      readdirSync("../../samples")
      .map(x => ({ 
        id: x.replace('.json', ''),
        href: `http://localhost:4322/nest/${x.replace('.json', '')}`
      })));
  }
  getOne(request: Request, response: Response) {
    response.status(200).send(readFileSync(`../../samples/${request.params.envId}.json`));
  }
  createOne(request: Request, response: Response) {
    writeFileSync(`../../samples/${request.body.id}.json`, JSON.stringify(request.body));
    response.status(200).send(readFileSync(`../../samples/${request.body.id}.json`));
  }
  updateOne(request: Request, response: Response) {
    writeFileSync(`../../samples/${request.params.envId}.json`,JSON.stringify(request.body))
    response.status(200).send(readFileSync(`../../samples/${request.params.envId}.json`));
  }
  deleteOne(request: Request, response: Response) {
    unlinkSync(`../../samples/${request.params.envId}.json`);
    response.status(200).send();
  }
}

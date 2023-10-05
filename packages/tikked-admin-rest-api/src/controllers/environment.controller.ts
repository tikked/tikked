import { Request, Response } from 'express';
import { readFileSync, readdirSync } from 'fs';

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
}

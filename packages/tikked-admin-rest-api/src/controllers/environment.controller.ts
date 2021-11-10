import { Request, Response } from 'express';

export default class EnvironmentController {
  getAll(request: Request, response: Response) {
    response.status(200).send('Getting all environments');
  }
}

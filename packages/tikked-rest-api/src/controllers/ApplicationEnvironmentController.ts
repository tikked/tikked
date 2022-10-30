import * as express from 'express';
import { ApplicationEnvironment, Context } from '@tikked/core';
import { ApplicationEnvironmentRepository } from '@tikked/persistency';
import { inject } from 'inversify';
import { controller, httpGet, interfaces, request, requestParam } from 'inversify-express-utils';
import { distinctUntilChanged, map, skip, take, timeout } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@controller('/application-environment')
export class ApplicationEnvironmentController implements interfaces.Controller {
  public constructor(
    @inject(ApplicationEnvironmentRepository) private repo: ApplicationEnvironmentRepository
  ) {}

  @httpGet('/:id')
  private index(
    @requestParam('id') id: string,
    @request() req: express.Request
  ): Promise<ApplicationEnvironment | undefined | void> {
    const wait = req.query.wait === 'true';
    return firstValueFrom(
      this.repo.get(id).pipe(
        distinctUntilChanged((x, y) => x === y),
        skip(wait ? 1 : 0),
        wait ? timeout(60000) : map((x) => x),
        take(1)
      )
    ).catch((err) => {
      if (!wait) {
        throw err;
      }
    });
  }

  @httpGet('/:id/feature-set')
  private featureSet(
    @requestParam('id') id: string,
    @request() req: express.Request
  ): Promise<Iterable<string> | void> {
    const data = Object.entries(req.query)
      .filter(([_, value]) => typeof value === 'string')
      .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
    const context = new Context(data);
    const wait = req.query.wait === 'true';
    return this.repo
      .get(id)
      .pipe(
        map((appEnv) => appEnv.getFeatureSet(context)),
        distinctUntilChanged((x, y) => eqSet(x, y)),
        skip(wait ? 1 : 0),
        wait ? timeout(60000) : map((x) => x),
        take(1),
        map((x) => [...x])
      )
      .toPromise()
      .catch((err) => {
        if (!wait) {
          throw err;
        }
      });
  }
}

const eqSet = <T>(as: Set<T>, bs: Set<T>) => {
  if (as.size !== bs.size) return false;
  for (const a of as) if (!bs.has(a)) return false;
  return true;
};

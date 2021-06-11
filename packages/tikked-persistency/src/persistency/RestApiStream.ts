import { concat, from, Observable, timer } from 'rxjs';
import { concatMap, retryWhen, shareReplay, delay } from 'rxjs/operators';
import { validateIsNotEmpty } from 'tikked-core';
import axios from 'axios';
import { DataStream } from '.';

export class RestApiStream implements DataStream {
  private obs: Observable<string>;

  /**
   * Creates a REST API stream. Use @member read to start observing the content.
   * @param url The path to the REST endpoint that hosts the Application Environment
   */
  public constructor(private url: string) {
    validateIsUrl(url);
  }

  public write(content: string): Promise<void> {
    return Promise.resolve();
  }

  public read(): Observable<string> {
    return this.getApplicationEnvironment();
  }

  private getApplicationEnvironment(): Observable<string> {
    if (!this.obs) {
      this.obs = concat(
        from(this.applicationEnvironment()),
        timer(0, 1).pipe(concatMap(_ => from(this.applicationEnvironmentWait())))
      ).pipe(
        retryWhen(errors => errors.pipe(delay(5000))),
        shareReplay(1)
      );
    }
    return this.obs;
  }

  private async applicationEnvironment(): Promise<string> {
    return JSON.stringify((await axios.get<string>(this.url)).data);
  }

  private async applicationEnvironmentWait(): Promise<string> {
    return JSON.stringify((await axios.get<string>(this.url, { params: { wait: 'true' } })).data);
  }
}

const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
function validateIsUrl(url: string): void
{
  validateIsNotEmpty(url);
  if(!urlRegex.test(url)){
    throw new Error(`String is not a valid URL: "${url}"`)
  }
}

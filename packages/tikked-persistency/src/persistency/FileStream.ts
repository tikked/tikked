import { promises as fsPromises, watch as fsWatch } from 'fs';
import { from, Observable, of } from 'rxjs';
import {
  concat,
  distinctUntilChanged,
  filter,
  mergeMap,
  share,
  tap
} from 'rxjs/operators';
import { validateIsNotEmpty } from 'tikked-core';
import { DataStream } from '.';

export class FileStream implements DataStream {
  private contentProm: Promise<string> | undefined;

  /**
   * Creates a file stream. Use @member read to start observing the content.
   * @param filePath The path to the file that is to be streamed
   * @param _load Promise based function used to load the file
   * - must be compatible with fs.promises.readFile
   * @param _watch Callback based function used to watch file for changes
   * - must be compatible with fs.watch
   * @param _write Promise based function for writing content to the file
   * - must be compatible with fs.promises.writeFile
   */
  public constructor(
    private filePath: string,
    private _load = (fp: string) => fsPromises.readFile(fp, 'utf8'),
    private _watch = (fp: string, watcher: (event: string) => void) =>
      fsWatch(fp, 'utf8', watcher),
    private _write = (fp: string, content: string) =>
      fsPromises.writeFile(fp, content, 'utf8')
  ) {
    validateIsNotEmpty(filePath);
  }

  public write(content: string): Promise<void> {
    return this._write(this.filePath, content);
  }

  public read(): Observable<string> {
    return of(1).pipe(
      concat(
        this.observeChange().pipe(tap(_ => (this.contentProm = undefined)))
      ),
      mergeMap(() => this.observeContent()),
      filter(val => val !== ''),
      distinctUntilChanged()
    );
  }

  private observeChange(): Observable<void> {
    return new Observable<void>(observer => {
      const watchToken = this._watch(
        this.filePath,
        event => event === 'change' && observer.next()
      );
      return () => watchToken.close();
    }).pipe(share());
  }

  private observeContent(): Observable<string> {
    if (!this.contentProm) {
      this.contentProm = this._load(this.filePath);
      this.contentProm.catch(err => {
        this.contentProm = undefined;
      });
    }
    return from(this.contentProm);
  }
}

import 'reflect-metadata';
import { Context } from 'tikked-core';
import { ApplicationEnvironmentRepository } from 'tikked-persistency';
import { parseCliArgs, showCliHelp } from './cliParser';
import { createContainer, createContainerRest } from './inversify.config';
import { combineLatest, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

const options = parseCliArgs();
if (options.help) {
  showCliHelp();
  process.exit(0);
}
const missingArgs = ['application-environment', 'root'].filter(
  option => !options[option]
);

if (missingArgs.length > 0) {
  const plural = missingArgs.length > 1 ? 's' : '';
  console.log(
    `Missing argument${plural}: ${missingArgs.join(
      ', '
    )}. See usage details below.`
  );
  showCliHelp();
  process.exit(1);
}

const container = /^https?:\/\//.test(options.root)
  ? createContainerRest(options.root)
  : createContainer(options.root);
const repo = container.get<ApplicationEnvironmentRepository>(
  ApplicationEnvironmentRepository
);

function observeConsole(): Observable<Context[]> {
  return new Observable<Context[]>(observer => {
    const contexts: Context[] = (options.context || []);
    const contextJson = (input: string) => new Context(JSON.parse(input));
    const stdin = process.openStdin();
    if(contexts.length > 0 ) {
      observer.next(contexts);
    }
    const func = function(d) {
      // note:  d is an object, and when converted to a string it will
      // end with a linefeed.  so we (rather crudely) account for that
      // with toString() and then trim()
      const val = d.toString().trim();
      try {
        if (val !== '') {
          if (val === 'clear') contexts.splice(0, contexts.length);
          else contexts.push(contextJson(val));
          observer.next(contexts);
        }
      } catch (e) {
        console.log('Not a valid context');
      }
    };
    stdin.addListener('data', func);
    return () => stdin.end();
  }).pipe(share());
}

combineLatest([repo.get(options['application-environment']), observeConsole()]).subscribe(
  {
    next: data => {
      const [appEnv, context] = data;
      context.forEach(element => {
        const featureSet = appEnv.getFeatureSet(element);
        console.log(element, featureSet);
      });
    }
  }
);

console.log('Try typing in some context, e.g. the empty context: "{}" or clear all your contexts with "clear"')

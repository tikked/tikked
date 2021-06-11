import 'reflect-metadata';
import { ApplicationEnvironmentRepository } from 'tikked-persistency';
import { parseCliArgs, showCliHelp } from './cliParser';
import { createContainer, createContainerRest } from './inversify.config';

const options = parseCliArgs();
if (options.help) {
  showCliHelp();
  process.exit(0);
}
const missingArgs = ['application-environment', 'root', 'context'].filter(
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

repo.get(options['application-environment']).subscribe({
  next: appEnv => {
    options.context.forEach(element => {
      const featureSet = appEnv.getFeatureSet(element);
      console.log(element, featureSet);
    });
  }
});

import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import { Context } from '@tikked/core';

const contextJson = (input: string) => new Context(JSON.parse(input));
const optionDefinitions = [
  {
    name: 'application-environment',
    alias: 'a',
    type: String,
    // tslint:disable-next-line: max-line-length
    description:
      'Name of the application environment to load. There must be a file named <application-environment>.json in the <root> folder'
  },
  {
    name: 'context',
    alias: 'c',
    type: contextJson,
    multiple: true,
    defaultOption: true,
    // tslint:disable-next-line: max-line-length
    description:
      'The context(s), in form of JSON object(s), which you want to test the feature flags of'
  },
  {
    name: 'root',
    alias: 'r',
    type: String,
    description: 'The root folder to search for the application environment'
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Shows this help text'
  }
];

export function parseCliArgs() {
  return commandLineArgs(optionDefinitions);
}

export function showCliHelp() {
  console.log(
    commandLineUsage([
      {
        header: 'tikked',
        content: 'A feature flag thingy'
      },
      {
        header: 'Synopsis',
        content: [
          // tslint:disable-next-line: max-line-length
          `$ tkd --root {underline folder or base-URL} --application-environment {underline string} [--context] {underline contextjson} ...`,
          '$ tkd --help'
        ]
      },
      {
        header: 'Options',
        optionList: optionDefinitions
      }
    ])
  );
}

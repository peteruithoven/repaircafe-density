import { runAnalyzeCommand } from './commands/analyze.js';
import { runFetchCommand } from './commands/fetch.js';
import { runGeocodeMissingCommand } from './commands/geocode-missing.js';
import { runListMissingCityCountryCommand } from './commands/list-missing-city-country.js';

const HELP_TEXT = `Repair Cafe city ranking CLI

Usage:
  node bin/cli.js fetch
  node bin/cli.js geocode-missing [--limit=100] [--delay-ms=250]
  node bin/cli.js analyze [--top=20]
  node bin/cli.js list-missing-city-country

Environment:
  GEOAPIFY_API_KEY   Required for geocode-missing
`;

export async function runCli(argv) {
  const [command, ...args] = argv;

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    console.log(HELP_TEXT);
    return;
  }

  switch (command) {
    case 'fetch':
      await runFetchCommand();
      return;
    case 'geocode-missing':
      await runGeocodeMissingCommand(parseOptions(args));
      return;
    case 'analyze':
      await runAnalyzeCommand(parseOptions(args));
      return;
    case 'list-missing-city-country':
      await runListMissingCityCountryCommand();
      return;
    default:
      throw new Error(`Unknown command: ${command}\n\n${HELP_TEXT}`);
  }
}

function parseOptions(args) {
  const options = {};

  for (const arg of args) {
    if (!arg.startsWith('--')) {
      throw new Error(`Unexpected argument: ${arg}`);
    }

    const [rawKey, rawValue] = arg.slice(2).split('=', 2);
    if (!rawKey) {
      throw new Error(`Invalid option: ${arg}`);
    }

    options[rawKey] = rawValue === undefined ? true : rawValue;
  }

  return options;
}

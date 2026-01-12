#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ask } from './commands/ask.tsx';
import { selectModel } from './commands/selectModel.tsx';
import { listHistory } from './commands/listHistory.ts';
import { clearHistory } from './commands/clearHistory.ts';
import { providers } from './commands/providers.tsx';
import { logo } from './utils/logo.ts';

void yargs(hideBin(process.argv))
  .scriptName('ask')
  .usage(`${logo}\nAI CLI to help you with commands, coding, apps and more.\n\nVersion: 1.0.7\n\nUsage: $0 <prompt..>`)
  .version('1.0.7')
  .locale('en')
  .example('$0 how to run a docker container', '')
  .example('how to setup my git account', '')
  .example('what is the chmod command', '')
  .example('$0 what is using port 80 -c "netstat -ano"', '')
  
  .help()
  .command({
    command: '$0 <prompt..>',
    describe: 'Ask something. Alias: what, how',
    builder: yargs => yargs
      .positional('prompt', { type: 'string', array: true, demandOption: true })
      .option('command', {
        alias: ['c'],
        type: 'string',
        description: 'Command to execute',
        requiresArg: true
      }),
    handler: (args) => ask(args.prompt.join(' '), args.command)
  })
  .command({
    command: '/models',
    describe: 'Select a model',
    handler: () => selectModel()
  })
  .command({
    command: '/providers',
    describe: 'Setup providers',
    handler: () => providers()
  })
  .command({
    command: '/history',
    describe: 'List the chat history',
    handler: () => listHistory()
  })
  .command({
    command: '/clear',
    describe: 'Clear the chat history',
    handler: () => clearHistory()
  })
  .parse();

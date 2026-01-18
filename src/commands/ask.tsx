import util from 'node:util';
import findProcess from 'find-process';
import chalk from 'chalk';
import { exec as execCb } from 'node:child_process';
import { useEffect, useState } from 'react';
import { Box, render, Static, Text, useApp } from 'ink';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { configStore } from '../stores/config.ts';
import { historyStore } from '../stores/history.ts';
import { Welcome } from '../components/welcome.tsx';
import { Loading } from '../components/loading.tsx';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { instructions } from '../templates/instructions.ts';
import { providers } from '../providers.ts';
import { Config } from '../types/config.ts';

const exec = util.promisify(execCb);

const config = await configStore.get();
const history = await historyStore.get();

export function ask(prompt: string, command?: string) {
  render(<Ask prompt={prompt} command={command}/>);
}

interface Props {
  prompt: string;
  command?: string;
}

function Ask(props: Props) {

  const { prompt, command } = props;

  const { exit } = useApp();

  const [view, setView] = useState<'ask' | 'welcome'>('ask');
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState('');
  const [meta, setMeta] = useState<{ model: string; time: number; inputTokens: number; outputTokens: number }>();
  const [exitCode, setExitCode] = useState<number>();
  const [isFirstRun, setIsFirstRun] = useState(false);

  useEffect(() => {
    void (async () => {
      if (config.model) {
        await send(config);
      } else {
        setView('welcome');
      }
    })();
  }, []);

  useEffect(() => {
    if (exitCode !== undefined) {
      setTimeout(() => exit(), 0);
    }
  }, [exitCode]);

  useEffect(() => {
    void historyStore.deleteOldHistory();
  }, []);

  async function handleSend() {
    setIsFirstRun(true);
    setView('ask');
    const config = await configStore.get();
    await send(config);
  }
  
  async function send(config: Config) {
    
    const modelId = config.model!.model;
    const providerId = config.model!.provider;
    const apikey = config.providers[providerId].apiKey!;
    const provider = providers.find(provider => provider.id === providerId);
    const model = provider?.models.find(model => model.name === modelId);
    
    if (!apikey) {
      console.error(`No API key found for the model ${chalk.bold(`${model!.title} (${provider!.name})`)}.\n`);
      console.error(`Use the command ${chalk.cyan(chalk.bold('ask /providers'))} to set the API key for the provider ${chalk.bold(provider!.name)}.`);
      setExitCode(1);
      return;
    }
    
    try {
      
      setSending(true);
      
      const prompt = await getPrompt();
      
      const modelClient = getModel(providerId, modelId, apikey);

      const startTime = Date.now();
      
      const response = await modelClient.invoke([
        { role: 'system', content: instructions },
        ...history.map(item => ({ ...item })),
        {  role: 'human',  content: prompt }
      ]);

      const endTime = Date.now();

      await historyStore.add([
        { role: 'human', content: prompt },
        { role: 'ai', content: response.text }
      ]);
      
      setResponse(response.text.replaceAll('\\x1b', '\x1b').replaceAll('\\n', '\n').concat('\x1b[0m'));
      
      setMeta({ 
        model: model!.title, 
        time: endTime - startTime,
        inputTokens: response.usage_metadata?.input_tokens || 0, 
        outputTokens: response.usage_metadata?.output_tokens || 0 
      });
      
      setSending(false);
      setExitCode(0);
      
    } catch (err) {

      console.error(`Error running model ${chalk.bold(`${model!.title} (${provider!.name})`)}:\n\n${(err as Error).message}`);

      setSending(false);
      setExitCode(1);
    }
  }

  async function getPrompt() {

    let result = prompt;

    if (command) {
      const commandOutput = await runCommand(command);
      result += `\n\nCommand: ${command}\n\nCommand output:\n\n${commandOutput}`;
    }

    return result;
  }

  function getModel(providerId: string, modelId: string, apiKey: string) {
    
    const provider = providers.find(provider => provider.id === providerId);
    const model = provider?.models.find(model => model.name === modelId);
    const maxOutputTokens = config.settings.maxOutputTokens.value as number;

    switch (providerId) {
      case 'openai': return new ChatOpenAI({ model: modelId, apiKey, ...model?.config, maxTokens: maxOutputTokens });
      case 'gemini': return new ChatGoogleGenerativeAI({ model: modelId, apiKey, ...model?.config, maxOutputTokens });
      case 'anthropic': return new ChatAnthropic({ model: modelId, apiKey, ...model?.config, maxTokens: maxOutputTokens });
      default: throw new Error('Model not found');
    }
  }

  async function runCommand(command: string) {    
    try {
      const [processInfo] = await findProcess.default('pid', process.ppid);
      const result = await exec(command, { shell: processInfo.name });
      return result.stdout;
    } catch (err) {
      const { stdout, stderr } = err as { stdout: string; stderr: string };
      return `Error executing command: \n\n${stdout}\n\n${stderr}`;
    }
  }

  function formatTime(time: number) {
    return time < 1000 * 60
      ? `${(time / 1000).toFixed(1)}s`
      : `${(time / (1000 * 60)).toFixed(1)}m`;
  }
  
  return (
    <Box>
      {view === 'welcome' && 
        <Welcome onSend={handleSend}/>
      }
      {view === 'ask' &&
        <Box>
          {isFirstRun &&
            <Static items={['']}>
              {item => 
                <Box key={item} marginBottom={1}>
                  <Text><Text color='cyan' bold>Prompt:</Text> {prompt}</Text>
                </Box>
              }
            </Static>
          }
          {sending &&
            <Loading/>
          }
          {!sending && response &&
            <Static items={['']}>
              {item =>
                <Box flexDirection='column' key={item}>
                  <Text>{response}</Text>
                  {config.settings.metadata.value &&meta &&
                    <Box marginTop={1}>
                      <Text color='gray' dimColor>
                        Model: {meta.model}, Time: {formatTime(meta.time)}, Tokens: {meta.inputTokens + meta.outputTokens}
                      </Text>
                    </Box>
                  }
                </Box>
              }
            </Static>
          }
        </Box>
      }
    </Box>
  );
}

import util from 'node:util';
import findProcess from 'find-process';
import chalk from 'chalk';
import { exec as execCb } from 'node:child_process';
import { useEffect, useState } from 'react';
import { Box, render, Static, Text } from 'ink';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { configStore } from '../stores/config.ts';
import { historyStore } from '../stores/history.ts';
import { Welcome } from '../components/welcome.tsx';
import { Loading } from '../components/loading.tsx';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { instructions } from '../templates/instructions.ts';
import { Config } from '../types/config.ts';
import { Provider } from '../types/provider.ts';
import { Model } from '../types/model.ts';
import { useExit } from '../hooks/useExit.ts';
import { SelectModel } from '../components/selectModel.tsx';

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

  const [view, setView] = useState<'ask' | 'select-model' | 'welcome'>('ask');
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState('');
  const [meta, setMeta] = useState<{ model: string; time: number; tokens: number }>();
  const [_, setExit] = useExit();
  const [isFirstRun, setIsFirstRun] = useState(false);

  useEffect(() => {
    void (async () => {
      if (config.isFirstExecution) {
        setView('welcome');
        setIsFirstRun(true);
      } else if (!config.model) {
        setView('select-model');
      } else {
        await send(config);
      }
    })();
  }, []);

  useEffect(() => {
    void historyStore.deleteOldHistory();
  }, []);

  async function handleSend() {
    setView('ask');
    const config = await configStore.get();
    config.isFirstExecution = false;
    await configStore.save(config);
    await send(config);
  }
  
  async function send(config: Config) {
    
    const modelId = config.model!.id;
    const providerId = config.model!.providerId;
    const provider = config.providers[providerId];
    const model = provider?.models.find(model => model.id === modelId);

    if (!model) {
      console.error(`Error: model ${chalk.bold(modelId)} not found`);
      setExit(true);
      return;
    }
    
    if (provider.type !== 'openai-compatible' && !provider.key) {
      console.error(`No API key found for the model ${chalk.bold(`(${provider.name}) ${model.name}`)}.\n`);
      console.error(`Use the command ${chalk.cyan(chalk.bold('ask /providers'))} to set the API key for the provider ${chalk.bold(provider.name)}.`);
      setExit(true);
      return;
    }
    
    try {
      
      setSending(true);
      
      const prompt = await getPrompt();
      
      const modelClient = getModel(provider, model);

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
        model: model.name,
        time: endTime - startTime,
        tokens: (response.usage_metadata?.input_tokens || 0) + (response.usage_metadata?.output_tokens || 0)
      });
      
      setSending(false);
      setExit(true);
      
    } catch (err) {

      console.error(`Error running model ${chalk.bold(`(${provider.name}) ${model.name}`)}:\n\n${(err as Error).message}`);

      setSending(false);
      setExit(true);
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

  function getModel(provider: Provider, model: Model) {
    
    const maxOutputTokens = config.settings.maxOutputTokens.value as number;

    switch (provider.type) {
      case 'openai': 
        return new ChatOpenAI({ 
          model: model.id, 
          apiKey: provider.key, 
          maxTokens: maxOutputTokens, 
          ...model?.config
        });
      case 'gemini': 
        return new ChatGoogleGenerativeAI({ 
          model: model.id, 
          apiKey: provider.key, 
          maxOutputTokens,
          ...model?.config
        });
      case 'anthropic': 
        return new ChatAnthropic({ 
          model: model.id, 
          apiKey: provider.key, 
          maxTokens: maxOutputTokens,
          ...model?.config
        });
      case 'openai-compatible': 
        return new ChatOpenAI({ 
          model: model.id, 
          apiKey: provider.key, 
          configuration: { baseURL: provider.url },
          maxTokens: maxOutputTokens
        });
      default: 
        throw new Error('Model not found');
    }
  }

  async function runCommand(command: string) {    
    try {
      const [processInfo] = await findProcess.default('pid', process.ppid);
      const name = processInfo.name.replace(/^-/, '');
      const result = await exec(command, { shell: name });
      return result.stdout;
    } catch (err) {
      const { stdout, stderr } = err as { stdout: string; stderr: string };
      return `Error executing command:\n\n${stdout}\n\n${stderr}`;
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
      {view === 'select-model' &&
        <SelectModel onSelect={handleSend}/>
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
                  {config.settings.metadata.value && meta &&
                    <Box marginTop={1}>
                      <Text color='gray' dimColor>
                        Model: {meta.model}, Time: {formatTime(meta.time)}, Tokens: {meta.tokens}
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

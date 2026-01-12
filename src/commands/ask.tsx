import util from 'node:util';
import path from 'node:path';
import fs from 'node:fs/promises';
import { exec as execCb } from 'node:child_process';
import findProcess from 'find-process';
import { useEffect, useState } from 'react';
import { Box, render, Static, Text, useApp } from 'ink';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { configStore } from '../stores/config.ts';
import { historyStore } from '../stores/history.ts';
import { Welcome } from '../components/welcome.tsx';
import { Loading } from '../components/loading.tsx';
import { root } from '../utils/root.ts';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { instructions } from '../templates/instructions.ts';
import { providers } from '../providers.ts';

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
  const [exitCode, setExitCode] = useState<number>();
  const [isFirstRun, setIsFirstRun] = useState(false);

  useEffect(() => {
    void (async () => {
      if (!config.model) return setView('welcome');
      await send(config.model.provider, config.model.model, config.model.apiKey);
    })();
  }, []);

  useEffect(() => {
    if (exitCode !== undefined) {
      setTimeout(() => exit(), 0);
    }
  }, [exitCode]);

  useEffect(() => {
    
    (async () => {
    
      const dirPath = path.join(root, '/data/chats');
      const fileNames = await fs.readdir(dirPath);
    
      const files = await Promise.all(fileNames.map(async name => {
        const filePath = path.join(dirPath, name);
        const stats = await fs.stat(filePath);
        return { path: filePath, time: stats.ctimeMs };
      }));

      const sortedFiles = files
        .sort((a, b) => b.time - a.time)
        .slice(10);
      
      await Promise.all(sortedFiles.map(file => fs.unlink(file.path)));
    })().catch(() => {});
  }, []);

  async function handleSend(modelId: string, apiKey: string) {
    setIsFirstRun(true);
    setView('ask');
    const config = await configStore.get();
    await send(config.model!.provider, modelId, apiKey);
  }
  
  async function send(providerId: string, modelId: string, apiKey: string) {
    
    try {
      
      setSending(true);

      const prompt = await getPrompt();
      
      const model = getModel(providerId, modelId, apiKey);
      
      const response = await model.invoke([
        { role: 'system', content: instructions },
        ...history.map(item => ({ ...item })),
        {  role: 'human',  content: prompt }
      ]);

      await historyStore.add([
        { role: 'human', content: prompt },
        { role: 'ai', content: response.text }
      ]);
      
      setResponse(response.text.replaceAll('\\x1b', '\x1b').replaceAll('\\n', '\n').concat('\x1b[0m'));
      setSending(false);
      setExitCode(0);
      
    } catch (err) {

      console.error('Error running model:', (err as Error).message);

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

    switch (providerId) {
      case 'openai': return new ChatOpenAI({ model: modelId, apiKey, ...model?.config });
      case 'gemini': return new ChatGoogleGenerativeAI({ model: modelId, apiKey, ...model?.config });
      case 'anthropic': return new ChatAnthropic({ model: modelId, apiKey, ...model?.config });
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
                <Text key={item}>{response}</Text>
              }
            </Static>
          }
        </Box>
      }
    </Box>
  );
}

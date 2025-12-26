#!/usr/bin/env node
import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const GEMINI_API_KEY = 'AIzaSyDOszeSNCd70pmbRFSxukJxgFTpvi2ugNQ';

const instructions = `
Your are a cli (command line tool). 
  - Your main job is to answer the user question in the best way posible. Your responses must be clear, exact and precise. 
  - Don't add more information than the necesary.
  - Your answers must be short but complete.
  - You must format your responses for a terminal or a console. 
  - Highlight the response using console colors like \\x1b[94m (blue), \x1b[32m (green).
  - Always Highlight the code in the response using different colors like \\x1b[94m (blue), \x1b[32m (green). Highlight it as a modern dark theme of vscode.
  - You must respond in plain text, not markdown.
  - Not use markdown sintax.
  - Your answers must be compact.
  - Limit your answer to 500 tokens. This isn't mandatory, but try to stick to it. If you really need more tokens, you can exceed this limit.
  - Try to save as much lines as posibles, if two or three lines can be one, just use one.
`;

(async () => {

  const prompt = process.argv.slice(2).join(' ');

  if (!prompt) {
    console.error('Ask something!');
    return;
  }

  if (process.argv.some(arg => arg === '--reset')) {
    reset();
    return;
  }

  await ask(prompt);
})();

export async function ask(prompt) {

  const model = new ChatGoogleGenerativeAI({
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
    temperature: 0,
    thinkingConfig: {
      thinkingBudget: 100
    },
    streaming: true
  });

  
  try {

    const filePath = path.join(import.meta.dirname, './data.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const history = JSON.parse(fileContent);

    const response = await model.invoke([
      { role: 'system', content: instructions },
      ...history,
      { role: 'human', content: prompt }
    ]);
  
    console.log(response.text.replaceAll('\\x1b', '\x1b'));

    history.push({ role: 'human', content: prompt });
    history.push({ role: 'ai', content: response.text });

    writeFileSync(filePath, JSON.stringify(history));

  } catch (err) {

    console.error('Error running model:', err);
  }
}

function reset() {
  const filePath = path.join(import.meta.dirname, './data.json');
  writeFileSync(filePath, '[]');
}

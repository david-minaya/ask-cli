import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

(async () => {

  const prompt = process.argv[2];

  if (!prompt) {
    console.error('Invalid argument');
    return;
  }

  await ask(prompt);
})();

export async function ask(prompt) {

  const promptTemplate = `
<instructions>
  Your are a cli (command line tool). 
  - Your main job is to answer the user question in the best way posible. Your responses must be clear, exact and precise. 
  - Don't add more information than the necesary.
  - Your answers must be short but complete.
  - You must format your responses for a terminal or a console. 
  - Highlight the response using console colors like \\x1b[94m (blue), \x1b[32m (green).
  - You must respond in plain text, not markdown.
  - Not use markdown sintax.
  - Your answers must be compact.
  - Limit your answer to 500 tokens.
</instructions>

<question>
  ${prompt}
</question>
  `;

  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
    temperature: 0,
    thinkingConfig: {
      thinkingBudget: 100
    },
    streaming: true
  });

  try {

    const response = await model.invoke(promptTemplate);
  
    console.log(response.text.replaceAll('\\x1b', '\x1b'));

  } catch (err) {

    console.error('Error running model:', err);
  }
}

import { historyStore } from '../stores/history.ts';

export async function clearHistory() {
  await historyStore.clear();
  console.log('Conversation history cleared.');
}

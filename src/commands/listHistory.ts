import { historyStore } from '../stores/history.ts';

export async function listHistory() {

  const history = await historyStore.get();
  
  if (history.length === 0) {
    console.log('No conversation history found.');
    return;
  }
    
  history.forEach((item, index) => {
    if (item.role === 'human') {
      if (index !== 0) console.log('');
      console.log('-----');
    }
    console.log(`${item.role === 'human' ? 'User' : 'Model' }:`, item.content.replaceAll('\\x1b', '\x1b').replaceAll('\\n', '\n'), '\x1b[0m');
  });
}

import { Message } from '../types/message.ts';
import { store } from './store.ts';

const path = `./data/chats/history.${process.ppid}.json`;

let history: Message[];

async function get() {
  if (history) return history;
  history = await store.get<Message[]>(path, []);
  return history;
}

async function add(message: Message | Message[]) {
  const messages = Array.isArray(message) ? message : [message];
  const history = await get();
  history.push(...messages);
  await save(history);
}

async function clear() {
  history = [];
  await save(history);
}

async function save(history: Message[]) {
  await store.save(path, history);
}

export const historyStore = {
  get,
  add,
  clear,
  save
};

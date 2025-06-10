import { createClient } from '@mocktailgpt/ts';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient();

async function run() {
  const res = await client.call('/my-endpoint', { query: 'Hello!' });
  console.log('Result:', res);
}

run();

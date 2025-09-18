// get-appointments.js
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'appointments.json');

export async function handler(event, context) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    let appointments = {};
    if (existsSync(DATA_FILE)) {
      appointments = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    }

    return {
      statusCode: 200,
      body: JSON.stringify(appointments),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '伺服器錯誤' }),
    };
  }
}

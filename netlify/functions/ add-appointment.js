// add-appointment.js
// Netlify Function
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'appointments.json');

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { name, phone, service, date, time } = JSON.parse(event.body);

    if (!name || !phone || !service || !date || !time) {
      return { statusCode: 400, body: JSON.stringify({ message: '缺少必要欄位' }) };
    }

    // 讀取原本資料
    let appointments = {};
    if (existsSync(DATA_FILE)) {
      appointments = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    }

    if (!appointments[date]) appointments[date] = [];
    appointments[date].push({ name, phone, service, time, createdAt: new Date().toISOString() });

    // 寫回檔案
    writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: '預約成功' }),
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '伺服器錯誤' }),
    };
  }
}

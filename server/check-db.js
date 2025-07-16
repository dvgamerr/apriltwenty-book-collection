import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Client } = pkg;

async function test() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    // เพิ่มตรงนี้ถ้าเจอปัญหา SSL
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('✅ เชื่อมต่อ DB สำเร็จ:', res.rows);
  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาดขณะเชื่อมต่อ:\n', err);
  } finally {
    await client.end();
  }
}

test();
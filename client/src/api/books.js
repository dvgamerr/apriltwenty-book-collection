import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000'; // ปรับ URL ตาม API ของคุณ

export async function getBooks() {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`);
    return response;
  } catch (error) {
    throw error;
  }
}
// src/api/authors.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

export async function getAuthors() {
  try {
    // ดึง token ที่เก็บไว้จาก localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found. Please login.');
    }
    // แนบ token ด้วย header Authorization ในรูปแบบ Bearer token
    const response = await axios.get(`${API_BASE_URL}/authors`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
}
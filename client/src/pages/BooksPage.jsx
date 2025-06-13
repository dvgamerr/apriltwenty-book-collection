import React, { useState, useEffect } from 'react';
import { getBooks } from '../api/books.js';
import BookItem from '../components/BookItem.jsx';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลเมื่อ component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getBooks(); // เรียกฟังก์ชัน getBooks
        console.log("API response:", response.data);

        setBooks(response.data.data);           // สมมติว่า API ส่ง data มาในรูปแบบ { data: [...] }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="books-page">
      <h2>รายชื่อหนังสือ</h2>
      {books.map((book) => (
        <BookItem key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BooksPage;
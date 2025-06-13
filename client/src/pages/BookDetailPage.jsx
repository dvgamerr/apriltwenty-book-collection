// src/pages/BookDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function BookDetailPage() {
  const { id } = useParams(); // ดึง id จาก URL
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        // สมมติว่า endpoint สำหรับรายละเอียดหนังสือคือ /books/:id
        const response = await axios.get(`http://localhost:4000/books/${id}`);
        // สมมติว่า API ส่งกลับในรูปแบบ { success: true, data: { ... } }
        if (response.data && response.data.success) {
          setBook(response.data.data);
        } else {
          setError('รูปแบบข้อมูลไม่ถูกต้อง');
        }
      } catch (err) {
        console.error(err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>{error}</div>;
  if (!book) return <div>ไม่พบข้อมูลหนังสือ</div>;

  return (
    <div className="book-detail" style={{ padding: '1rem' }}>
      <button onClick={() => navigate('/books')} style={{ marginBottom: '1rem' }}>
        Back to Books
      </button>

      <h2>{book.title}</h2>
      <img
        src={book.cover_url}
        alt={book.title}
        style={{ width: '200px', margin: '1rem 0' }}
      />
      <p>{book.description}</p>
      <p>
        <strong>ผู้แต่ง:</strong> {Array.isArray(book.author) ? book.author.join(', ') : book.author}
      </p>
      <p>
        <strong>หมวดหมู่:</strong> {Array.isArray(book.category) ? book.category.join(', ') : book.category}
      </p>
      <p>
        <strong>ISBN:</strong> {book.isbn}
      </p>
      <p>
        <strong>ปีที่ตีพิมพ์:</strong> {book.published_year}
      </p>
      <p>
        <strong>สำนักพิมพ์:</strong> {book.publisher}
      </p>
    </div>
  );
}

export default BookDetailPage;
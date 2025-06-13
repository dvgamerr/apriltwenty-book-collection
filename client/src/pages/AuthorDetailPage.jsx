// src/pages/AuthorDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthorDetailPage() {
  const { id } = useParams(); // ดึง parameter id จาก URL
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAuthor() {
      try {
        // สมมติว่า endpoint สำหรับรายละเอียดผู้แต่งคือ /authors/:id
        const token = localStorage.getItem('token'); // ดึง token จาก localStorage
        const response = await axios.get(`http://localhost:4000/authors/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // สมมติว่า API ส่งกลับในรูปแบบ { success: true, data: { ... } }
        if (response.data && response.data.success) {
          setAuthor(response.data.data);
        } else {
          setError('ข้อมูลที่ได้รับไม่ถูกต้อง');
        }
      } catch (err) {
        console.error("Error fetching author detail:", err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    }
    fetchAuthor();
  }, [id]);

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>{error}</div>;
  if (!author) return <div>ไม่พบข้อมูลผู้แต่ง</div>;

  return (
    <div className="author-detail" style={{ padding: '1rem' }}>
      {/* ปุ่มกลับไปหน้าผู้แต่ง */}
      <Link to="/authors">
        <button style={{ marginBottom: '1rem' }}>Back to Authors</button>
      </Link>

      <h2>{author.name}</h2>
      
      {/* ถ้ามี field รูปภาพ */}
      {author.photo_url && (
        <img 
          src={author.photo_url} 
          alt={author.name} 
          style={{ width: '200px', marginBottom: '1rem' }}
        />
      )}

      {/* ถ้ามีรายละเอียดชีวประวัติ */}
      {author.biography && (
        <p>{author.biography}</p>
      )}

      {/* ถ้ามีรายการหนังสือที่เขียน */}
      {author.books && author.books.length > 0 && (
        <div>
          <h3>หนังสือที่เขียน:</h3>
          <ul>
            {author.books.map((book) => (
              <li key={book.book_id}>{book.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AuthorDetailPage;
// src/pages/AuthorsPage.jsx
import React, { useState, useEffect } from 'react';
import { getAuthors } from '../api/authors';
import AuthorItem from '../components/AuthorItem';

function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAuthors() {
      try {
        const response = await getAuthors();
        console.log("Authors API response:", response.data);
        // สมมติ API ส่งกลับในรูปแบบ { success: true, data: [...] }
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setAuthors(response.data.data);
        } else {
          console.error("ข้อมูลผู้แต่งไม่ถูกต้อง:", response.data);
          setError("ข้อมูลที่ได้รับไม่ถูกต้อง");
        }
      } catch (err) {
        console.error("Error fetching authors:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    }
    fetchAuthors();
  }, []);

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>รายชื่อผู้แต่ง</h2>
      {authors.map((author) => (
        <AuthorItem key={author.author_id} author={author} />
      ))}
    </div>
  );
}

export default AuthorsPage;
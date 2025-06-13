// src/components/NavBar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // ตัวเลือก: ไม่แสดง NavBar ในหน้าล็อกอิน ถ้าต้องการ
  if (location.pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    // ลบ token จาก localStorage
    localStorage.removeItem('token');
    // นำทางกลับไปที่หน้าล็อกอิน
    navigate('/', { replace: true });
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid #ccc',
        marginBottom: '1rem'
      }}
    >
      <div>
        <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none' }}>
          Home
        </Link>
        <Link to="/books" style={{ marginRight: '1rem', textDecoration: 'none' }}>
          Books
        </Link>
        {token && (
          <Link to="/authors" style={{ marginRight: '1rem', textDecoration: 'none' }}>
            Authors
          </Link>
        )}
      </div>
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">
          <button>Login</button>
        </Link>
      )}
    </nav>
  );
}

export default NavBar;
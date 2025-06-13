// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    // ตรวจสอบว่ารหัสผ่านกับการยืนยันรหัสผ่านตรงกันไหม
    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:4000/auth/register', {
        username,
        email,
        password,
      });
      
      // สมมติว่า API ส่งกลับในรูปแบบ { success: true, data: ... }
      if (response.data && response.data.success) {
        setSuccess(true);
        setError(null);
        // หลังจากลงทะเบียนสำเร็จแล้ว, redirect ไปที่หน้าล็อกอิน
        navigate('/login');
      } else {
        setError('เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ</p>}
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Username: </label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Email: </label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Password: </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Confirm Password: </label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
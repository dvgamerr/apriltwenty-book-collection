// src/components/UnauthenticatedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const UnauthenticatedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // ตรวจสอบ token
  if (token) {
    // ถ้ามี token (ล็อกอินแล้ว) ให้นำทางไปยังหน้าหลัก
    return <Navigate to="/" replace />;
  }
  // ถ้ายังไม่ได้ล็อกอินให้แสดงเนื้อหาปกติ
  return children;
};

export default UnauthenticatedRoute;
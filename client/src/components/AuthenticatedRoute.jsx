// src/components/AuthenticatedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // ตรวจสอบ token ที่เก็บไว้
  if (!token) {
    // ถ้าไม่มี token (ยังไม่ได้ล็อกอิน) ให้ redirect ไปที่หน้าล็อกอิน
    return <Navigate to="/login" replace />;
  }
  // ถ้ามี token แสดงเนื้อหาที่ต้องการได้
  return children;
};

export default AuthenticatedRoute;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("รูปแบบข้อมูล User ไม่ถูกต้อง:", error);
  }

  // 1. ด่านแรก: เช็คว่ามี Token และ User ไหม? (ถ้าไม่มีคือยังไม่ได้ล็อกอิน)
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. ด่านสอง: เช็คสิทธิ์ Role ว่าเป็น Admin หรือไม่
  // ดึง role มาทำเป็นตัวพิมพ์เล็กทั้งหมดเพื่อความชัวร์ (ตรงกับ "admin" ในฐานข้อมูล)
  const userRole = user.role ? user.role.toLowerCase() : '';

  if (userRole !== "admin") {
    alert("Access Denied: เฉพาะผู้ดูแลระบบเท่านั้นที่มีสิทธิ์เข้าถึงหน้านี้ค่ะ");
    return <Navigate to="/dd" replace />;
  }

  // 3. ผ่านทุกด่าน อนุญาตให้เข้าหน้า Admin ได้เลย
  return <Outlet />;
}
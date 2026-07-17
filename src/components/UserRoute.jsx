import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function UserRoute() {
  // 1. ดึงข้อมูลจาก localStorage หรือ sessionStorage แบบเดียวกับ Admin
  const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    // console.error("รูปแบบข้อมูล User ไม่ถูกต้อง:", error);
  }

  // 2. เช็คว่ามี Token และ User ไหม? (ถ้าไม่มีคือยังไม่ได้ล็อกอิน หรือ Session หมดอายุ)
  if (!token || !user) {
    // ถ้ายังไม่ได้ล็อกอิน ให้เด้งไปหน้า login
    return <Navigate to="/login" replace />;
  }

  // 3. ด่านสอง (ทางเลือกเพิ่มเติม): 
  // ปกติหน้า User ทั่วไป (เช่น Dashboard) ใครที่ล็อกอินผ่านก็จะเข้าได้
  // แต่ถ้าคุณต้องการแยกขาดว่า "Admin ห้ามเข้าหน้า User ให้ไปหน้า Admin อย่างเดียว" 
  // คุณสามารถเปิดใช้งานโค้ดส่วนนี้ได้ครับ:
  
  /*
  const userRole = user.role ? user.role.toLowerCase() : '';
  if (userRole === "admin") {
    // ถ้าเป็น Admin เผลอหลงเข้ามา ให้เด้งกลับไปหน้า Admin
    return <Navigate to="/admin" replace />;
  }
  */

  // 4. ผ่านด่าน อนุญาตให้เข้าหน้า User ได้เลย
  return <Outlet />;
}
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  // ดึงข้อมูล Session จาก LocalStorage มาตรวจสอบ
  const sessionString = localStorage.getItem("user_session");
  const session = sessionString ? JSON.parse(sessionString) : {};

  // 1. ด่านแรก: เช็คว่าล็อกอินหรือยัง? 
  // ถ้ายังไม่ได้ล็อกอิน ให้ส่งกลับไปหน้า /login
  if (!session.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2. ด่านสอง: ล็อกอินแล้ว แต่ "ใช่ Admin ไหม?"
  // ถ้าไม่ใช่ Admin ให้แจ้งเตือนและส่งกลับไปหน้า Dashboard ปกติ
  if (session.role !== "admin") {
    alert("Access Denied: เฉพาะผู้ดูแลระบบเท่านั้นที่มีสิทธิ์เข้าถึงหน้านี้");
    return <Navigate to="/dd" replace />;
  }

  // 3. ผ่านทุกด่าน: อนุญาตให้เข้าถึงหน้าของ Admin ได้
  // <Outlet /> คือตัวแทนของ Component (หน้าเว็บ) ที่เราเอา AdminRoute ไปครอบไว้
  return <Outlet />;
}
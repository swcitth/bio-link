import React from 'react';
import Header from '../components/Navbar/Header';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      
      {/* เรียกใช้ Header Component */}
      <Header />

      {/* ส่วนเนื้อหาหลัก จัดให้อยู่กึ่งกลางหน้าจอ */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 pt-24 pb-12">
        
        {/* เรียกใช้กล่อง Form Component */}
        <LoginForm />

      </main>
      
    </div>
  );
}
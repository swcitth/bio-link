import React, { useState } from 'react';
import { User, Lock } from 'lucide-react'; 
import ButtonBig from '../Button/button_big';
import InputField from './InputField'; 
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginForm({ onSwitchView, onForgotPassword }) {

  // ส่วนตั้งค่าเริ่มต้น (Hooks & States)
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้าเว็บโดยไม่ต้องโหลดหน้าใหม่
  const [isLoading, setIsLoading] = useState(false); // ใช้เก็บสถานะตอนกำลังโหลด (ป้องกันผู้ใช้กดปุ่มรัวๆ)

  // ฟังก์ชันจำลองการบันทึกผู้ใช้ใหม่ลงฐานข้อมูล (ให้หน้า Admin เห็น)
  const syncUserToAdminDatabase = (newUser) => {
    // 1. ดึงสมุดรายชื่อผู้ใช้ทั้งหมดที่หน้า Admin ใช้
    const savedUsersStr = localStorage.getItem("system_users");
    let existingUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    // 2. เช็คว่ามีคนนี้ในระบบหรือยัง (หาจากอีเมล)
    const isUserExist = existingUsers.find(u => u.email === newUser.email);

    // 3. ถ้ายังไม่มี (แปลว่าเป็นคนสมัครใหม่) ให้เพิ่มชื่อลงไปในสมุด!
    if (!isUserExist && newUser.email) {
      const newUserForAdmin = {
        id: Date.now(), // สุ่ม ID จำลอง
        name: newUser.name || "Unknown User",
        email: newUser.email,
        role: newUser.role.toUpperCase(), // แปลงเป็นตัวพิมพ์ใหญ่ (ADMIN, USER) ให้ตรงกับหน้าเว็บแอดมิน
        date: new Date().toISOString().split('T')[0], // วันที่วันนี้ (YYYY-MM-DD)
        status: "Active",
        avatar: newUser.avatar || `https://ui-avatars.com/api/?name=${newUser.username}&background=random&color=fff`
      };
      
      // เอาผู้ใช้ใหม่ต่อท้ายเข้าไป แล้วเซฟกลับลง LocalStorage
      existingUsers.push(newUserForAdmin);
      localStorage.setItem("system_users", JSON.stringify(existingUsers));
    }
  };

  // ส่วนจัดการการล็อกอินด้วย Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true); // เริ่มแสดงสถานะโหลด
      try {
        // นำ Access Token วิ่งไปขอข้อมูลรายละเอียดบัญชี (ชื่อ, อีเมล, รูปโปรไฟล์) จาก Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        // จำลองการสร้าง Session สำหรับคนล็อกอินด้วย Google (ให้เป็น user ทั่วไปเสมอ)
        const userSession = {
          name: userInfo.name,
          email: userInfo.email,
          avatar: userInfo.picture,
          isLoggedIn: true,
          role: 'user' 
        };
        localStorage.setItem("user_session", JSON.stringify(userSession)); // เซฟลงเครื่อง
        
        // จำลองการสร้างโปรไฟล์ตั้งต้นของระบบ Bio Link ให้ผู้ใช้ใหม่
        const defaultProfile = {
          name: userInfo.name,
          bio: "ยินดีต้อนรับสู่ MyBioLink ของฉัน ✨",
          avatar: userInfo.picture,
          username: userInfo.email.split('@')[0] // ตัดเอาเฉพาะคำข้างหน้า @ มาเป็นชื่อเว็บ
        };
        localStorage.setItem("bio_profile", JSON.stringify(defaultProfile));

        syncUserToAdminDatabase(userSession);

        alert(`ยินดีต้อนรับคุณ ${userInfo.name}!`);
        navigate('/dd'); // คนล็อกอินผ่าน Google ให้ไปหน้า Dashboard ของ User ปกติ
        
      } catch (error) {
        console.error("Error retrieving user identity data:", error);
        alert("ไม่สามารถเข้าถึงข้อมูลสิทธิ์ของผู้ใช้งานได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setIsLoading(false); // ปิดสถานะโหลดไม่ว่าจะสำเร็จหรือพัง
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      alert("การเข้าสู่ระบบผ่าน Google ถูกยกเลิกหรือล้มเหลว");
    }
  });

  //ส่วนจัดการการล็อกอินแบบปกติ (พิมพ์รหัสผ่าน)
  const handleLogin = async (e) => {
    e.preventDefault(); // ป้องกันพฤติกรรมพื้นฐานของฟอร์ม (ไม่ให้หน้าเว็บรีเฟรชเองตอนกดปุ่ม)

    // ดึงค่าจากช่อง Input ตาม ID ที่ตั้งไว้
    const identifier = document.getElementById("login-identifier").value.trim();
    const password = document.getElementById("login-password").value;

    // ดักจับคนไม่ยอมกรอกข้อมูล
    if (!identifier || !password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return; // สั่งหยุดการทำงานทันที
    }

    //จำลองการเช็คว่าเป็น Admin หรือไม่ (เปลี่ยนจากโค้ดตรงนี้เป็นยิง API ไปเช็คกับ Backend ในอนาคต)
    let userRole = "user"; 
    if ((identifier === "admin") && password === "1234") {
      userRole = "admin"; 
    }

    // เช็คว่าผู้ใช้กรอกอีเมล (มี @) หรือกรอกแค่ Username
    const isEmail = identifier.includes("@");

    // รวบรวมข้อมูลเพื่อทำบัตรผ่าน (Session) ให้ผู้ใช้งาน
    const userSession = {
      name: userRole === "admin" ? "ผู้ดูแลระบบสูงสุด" : "ผู้ใช้งานทั่วไป",
      email: isEmail ? identifier : `${identifier}@example.com`, 
      username: isEmail ? identifier.split('@')[0] : identifier, 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      isLoggedIn: true,
      role: userRole 
    };
    
    // เซฟบัตรผ่านลงเบราว์เซอร์
    localStorage.setItem("user_session", JSON.stringify(userSession));

    syncUserToAdminDatabase(userSession);

    // Routing Redirector
    if (userRole === "admin") {
      navigate('/admin'); 
    } else {
      navigate('/dd'); 
    }
  };

  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* ส่วนหัวเรื่อง */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">ยินดีต้อนรับกลับมา</h1>
        <p className="text-sm text-slate-500">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
      </div>

      {/* ตัวฟอร์มหลัก: ทันทีที่ผู้ใช้กดปุ่ม submit หรือกด Enter 
        ระบบจะเรียกใช้งานฟังก์ชัน handleLogin ด้านบนทันที 
      */}
      <form className="flex flex-col gap-5" onSubmit={handleLogin}>
        
        {/* ช่องกรอก Username / Email */}
        <InputField 
          id="login-identifier" 
          label="อีเมล หรือ ชื่อผู้ใช้" 
          type="text" 
          placeholder="your@email.com หรือ username" 
          icon={User} 
        />

        {/* ช่องกรอกรหัสผ่าน (type="password" ทำให้เป็นจุดไข่ปลา) */}
        <InputField 
          id="login-password" 
          label="รหัสผ่าน" 
          type="password" 
          placeholder="••••••••" 
          icon={Lock} 
        />

        {/* ตัวเลือกเสริม: จดจำรหัสผ่าน และ ลืมรหัสผ่าน */}
        <div className="flex items-center justify-between mt-1 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-600">จดจำฉันไว้ในระบบ</span>
          </label>
          <button 
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors focus:outline-none"
          >
            ลืมรหัสผ่าน?
          </button>
        </div>

        {/* ปุ่มเข้าสู่ระบบหลัก */}
        <ButtonBig type="submit">
          เข้าสู่ระบบ
        </ButtonBig>

        {/* เส้นคั่นกลาง OR */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-medium">หรือดำเนินการต่อด้วย</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* ปุ่มล็อกอินด้วยบัญชีโซเชียล (Google) จัดให้อยู่กึ่งกลาง */}
        <div className="flex justify-center w-full">
          <button 
            type="button" 
            onClick={loginWithGoogle}
            disabled={isLoading} // ป้องกันการกดซ้ำซ้อนถ้ากำลังโหลดอยู่
            className="w-full sm:w-2/3 md:w-1/2 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>
      </form>

      {/* ลิงก์สำหรับผู้ใช้ที่ยังไม่มีบัญชี */}
      <div className="mt-8 text-center text-sm text-slate-600">
        ยังไม่มีบัญชีใช่ไหม?{' '}
        <button 
          onClick={onSwitchView} // เรียกฟังก์ชันสลับ Component กลับไปที่หน้าสมัครสมาชิก
          className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none"
        >
          สมัครสมาชิก
        </button>
      </div>
    </div>
  );
}
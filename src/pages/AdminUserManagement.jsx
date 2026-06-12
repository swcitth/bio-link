import React, { useState, useEffect } from 'react';
import { Search, Eye, Ban, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Navbar/Header'; 
import { useNavigate } from 'react-router-dom';

// 1. เตรียมข้อมูลตั้งต้น (เอาไว้ใช้กรณีที่ระบบเพิ่งเปิดใช้งานครั้งแรกและยังไม่มีข้อมูลเลย)
const DEFAULT_USERS = [
  { id: 1, name: "Tanattha Potikarn", email: "admin@system.com", role: "admin", status: "active", joinDate: "2026-01-10", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" },
  { id: 2, name: "John Doe", email: "john@example.com", role: "user", status: "active", joinDate: "2026-05-15", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" },
  { id: 3, name: "Spammer Shop", email: "spam123@fake.com", role: "user", status: "banned", joinDate: "2026-06-01", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" }
];

export default function AdminUserManagement() {
  const navigate = useNavigate();
  
  // เริ่มต้น State ด้วย Array ว่างๆ ก่อน
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // ดึงข้อมูลจาก LocalStorage ตอนเปิดหน้าเว็บ
  useEffect(() => {
    const savedUsers = localStorage.getItem("system_users");
    
    if (savedUsers) {
      // ถ้าเคยมีข้อมูลเซฟไว้แล้ว ให้ดึงมาใช้
      setUsers(JSON.parse(savedUsers));
    } else {
      // ถ้ายังไม่มี (รันครั้งแรก) ให้เอา DEFAULT_USERS ใส่เข้าไปเป็นทุนเริ่มต้น
      localStorage.setItem("system_users", JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    }
  }, []);

  // สร้างฟังก์ชันตัวกลางสำหรับ "เซฟข้อมูลลง LocalStorage"
  const updateUsersData = (newUsersArray) => {
    setUsers(newUsersArray); // อัปเดตหน้าจอ React
    localStorage.setItem("system_users", JSON.stringify(newUsersArray)); // เซฟลง LocalStorage
  };

  // กรองข้อมูลตามการค้นหา
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // แก้ไขฟังก์ชันแบนผู้ใช้ ให้เรียกใช้ updateUsersData
  const handleBanUser = (id) => {
    if(window.confirm("คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนสถานะผู้ใช้งานรายนี้?")) {
      const updatedUsers = users.map(u => 
        u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u
      );
      updateUsersData(updatedUsers); // สั่งเซฟ
    }
  };

  //  แก้ไขฟังก์ชันลบผู้ใช้ ให้เรียกใช้ updateUsersData
  const handleDeleteUser = (id) => {
    if(window.confirm("การลบข้อมูลจะไม่สามารถกู้คืนได้ ยืนยันการลบ?")) {
      const remainingUsers = users.filter(u => u.id !== id);
      updateUsersData(remainingUsers); // สั่งเซฟ
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Header onLogoClick={() => navigate('/dd')} showBackButton={true} />

      <main className="max-w-6xl mx-auto px-4 pt-28">
        
        {/* หัวข้อหน้าจอ */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">จัดการผู้ใช้งาน (User Management)</h1>
          <p className="text-slate-500 mt-1">ดูแลบัญชีผู้ใช้ แบน หรือลบบัญชีที่ทำผิดกฎระบบ</p>
        </div>

        {/* ส่วนค้นหาและฟิลเตอร์ */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="ค้นหาชื่อ หรือ อีเมล..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">สถานะ:</span>
            <select
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">ทั้งหมด (All)</option>
              <option value="active">ปกติ (Active)</option>
              <option value="banned">ถูกแบน (Banned)</option>
            </select>
          </div>
        </div>

        {/* ตารางข้อมูลผู้ใช้ */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">ผู้ใช้งาน</th>
                  <th className="px-6 py-4 font-medium">สิทธิ์ (Role)</th>
                  <th className="px-6 py-4 font-medium">วันที่สมัคร</th>
                  <th className="px-6 py-4 font-medium">สถานะ</th>
                  <th className="px-6 py-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                      ไม่พบข้อมูลผู้ใช้งานที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* ข้อมูลโปรไฟล์ */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'}
                        `}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>

                      {/* วันที่สมัคร */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.joinDate}
                      </td>

                      {/* สถานะ */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${user.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}
                        `}>
                          {user.status === 'active' ? 'Active' : 'Banned'}
                        </span>
                      </td>

                      {/* ปุ่ม Action */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button title="ดูหน้าโปรไฟล์" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={18} />
                          </button>
                          
                          {/* ถ้าเป็น admin จะไม่ให้แบน/ลบ ตัวเอง */}
                          {user.role !== 'admin' && (
                            <>
                              <button 
                                onClick={() => handleBanUser(user.id)}
                                title={user.status === 'banned' ? "ปลดแบน" : "แบนผู้ใช้"} 
                                className={`p-2 rounded-lg transition-colors ${user.status === 'banned' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-orange-400 hover:text-orange-600 hover:bg-orange-50'}`}
                              >
                                <Ban size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                title="ลบผู้ใช้" 
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <span className="text-sm text-slate-500">แสดงผล 1 ถึง {filteredUsers.length} จากทั้งหมด</span>
            <div className="flex gap-1">
              <button className="p-1 rounded border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-50"><ChevronLeft size={16} /></button>
              <button className="p-1 rounded border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
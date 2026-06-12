import React, { useState, useEffect } from "react";
import { 
  Search, 
  ChevronDown, 
  Ban, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  LogOut
} from "lucide-react";
import Header from '../components/Navbar/Header'; 
import { useNavigate } from 'react-router-dom';

export default function AdminUserManagement() {
  const navigate = useNavigate();

  // State Management
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // ระบบ LocalStorage Database
  useEffect(() => {
    const savedUsers = localStorage.getItem("system_users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      localStorage.setItem("system_users", JSON.stringify([]));
      setUsers([]);
    }
  }, []);

  const updateUsersData = (newUsersArray) => {
    setUsers(newUsersArray);
    localStorage.setItem("system_users", JSON.stringify(newUsersArray));
  };

  // Handlers
  const handleRoleChange = (id, newRole) => {
    const updatedUsers = users.map(u => u.id === id ? { ...u, role: newRole } : u);
    updateUsersData(updatedUsers);
  };

  const toggleBan = (id) => {
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "Active" ? "Banned" : "Active" };
      }
      return u;
    });
    updateUsersData(updatedUsers);
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้?")) {
      const remainingUsers = users.filter(u => u.id !== id);
      updateUsersData(remainingUsers);
    }
  };

  // เมื่อกดลูกตาให้รีไดเล้กไปหน้า preview page
  const handlePreviewProfile = (user) => {
    // 1. ดึง username ออกมา (ถ้าในข้อมูลไม่มีคีย์ username ให้จำลองด้วยการตัดข้อความหน้า @ ของอีเมล)
    const targetUsername = user.username || user.email.split('@')[0];
    // 2. ใช้คำสั่ง window.open เพื่อเปิดลิงก์ในแท็บใหม่ ('_blank')
    window.open(`/${targetUsername}?source=admin`, '_blank');
  };

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("user_session"); 
      navigate('/'); 
    }
  };

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === "All" ? true : u.role === filterRole;
    const matchStatus = filterStatus === "All" ? true : u.status === filterStatus;
    
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      {/* ---------------- Navbar  ---------------- */}
      <Header onLogoClick={() => navigate('/dd')}>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-[#FF3B30] hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <LogOut size={16} strokeWidth={2.5} />
          ออกจากระบบ
        </button>
      </Header>

      {/* ---------------- Main Content ---------------- */}
      <main className="max-w-5xl mx-auto px-4 pt-28">
        
        {/* Main Card */}
        <div className="bg-white rounded-[1.5rem] p-8 shadow-sm">
          
          {/* Header Texts */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">จัดการผู้ใช้งาน (User Management)</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">ดูแลบัญชีผู้ใช้ แบน หรือลบบัญชีที่ทำผิดกฎระบบ</p>
          </div>

          {/* Search Box */}
          <div className="relative mb-8 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ หรือ อีเมล..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#F4F5F7] border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* User Table (CSS Grid) */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
              
              {/* Table Header */}
              <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 pb-4 border-b border-slate-100 px-4">
                <div className="text-xs font-bold text-slate-500">ผู้ใช้งาน</div>
                
                {/* Role Header - ⭐️ เปลี่ยนให้จัดกึ่งกลาง (justify-center) */}
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 relative cursor-pointer group">
                  <span>สิทธิ์ (Role)</span>
                  <ChevronDown size={14} className="group-hover:text-slate-700" />
                  <select 
                    value={filterRole} 
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  >
                    <option value="All">ทั้งหมด</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                  </select>
                </div>

                {/* Date Header - ⭐️ เปลี่ยนให้จัดกึ่งกลาง (text-center) */}
                <div className="text-xs font-bold text-slate-500 text-center">วันที่สมัคร</div>
                
                {/* Status Header - ⭐️ เปลี่ยนให้จัดกึ่งกลาง (justify-center) */}
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 relative cursor-pointer group">
                  <span>สถานะ</span>
                  <ChevronDown size={14} className="group-hover:text-slate-700" />
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  >
                    <option value="All">ทั้งหมด</option>
                    <option value="Active">Active</option>
                    <option value="Banned">Banned</option>
                  </select>
                </div>
                
                <div className="text-xs font-bold text-slate-500 text-right">จัดการ</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col divide-y divide-slate-50">
                {filteredUsers.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 font-medium">
                    ไม่พบข้อมูลผู้ใช้งานที่ค้นหา
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 py-4 px-4 items-center hover:bg-slate-50/50 transition-colors rounded-xl">
                      
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-slate-200" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>

                      {/* Role Pill - ⭐️ จัดปุ่มให้อยู่กึ่งกลาง */}
                      <div className="flex justify-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border relative ${
                          user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          <span>{user.role}</span>
                          <ChevronDown size={12} />
                          <select 
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="USER">USER</option>
                          </select>
                        </div>
                      </div>

                      {/* Date Text - ⭐️ จัดข้อความให้อยู่กึ่งกลาง */}
                      <div className="text-sm text-slate-600 font-medium text-center">
                        {user.date}
                      </div>

                      {/* Status Pill - ⭐️ จัดปุ่มให้อยู่กึ่งกลาง */}
                      <div className="flex justify-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                          user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {user.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== 'ADMIN' && (
                          <>
                            <button 
                              onClick={() => handlePreviewProfile(user)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                              title="ตรวจสอบโปรไฟล์ (Preview)"
                            >
                              <Eye size={18} strokeWidth={2} />
                            </button>
                            <button 
                              onClick={() => toggleBan(user.id)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                user.status === 'Banned' 
                                  ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                                  : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-red-500'
                              }`}
                              title={user.status === 'Banned' ? "ยกเลิกแบน" : "แบนผู้ใช้"}
                            >
                              <Ban size={16} strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => handleDelete(user.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                              title="ลบผู้ใช้"
                            >
                              <Trash2 size={16} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

          {/* Pagination Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
            <span className="text-sm text-slate-500 font-medium">
              แสดงผล 1 ถึง {filteredUsers.length} จากทั้งหมด {users.length}
            </span>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Floating Save Button Area */}
        <div className="flex justify-end mt-6">
          <button 
            onClick={() => alert("ระบบได้บันทึกการเปลี่ยนแปลงล่าสุดไว้ในฐานข้อมูลจำลองเรียบร้อยแล้ว!")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-8 rounded-full transition-all shadow-md shadow-purple-600/20 active:scale-95"
          >
            บันทึก
          </button>
        </div>

      </main>
    </div>
  );
}
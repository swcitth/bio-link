import React, { useState, useEffect } from "react";
// 1. เพิ่ม Download เข้ามาใน import ของ lucide-react
import { Search, ChevronDown, Ban, Trash2, ChevronLeft, ChevronRight, Eye, Download } from "lucide-react"; 
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios"; 
import DownloadModal from '../../components/admin/dashboard/DownloadModal';

export default function AdminUserManagement() {
  const navigate = useNavigate();

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // 1. ดึงข้อมูลจาก API
  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin');
      if (response.data.status === 'success') {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("ดึงข้อมูลผู้ใช้ล้มเหลว:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. อัปเดตสิทธิ์ (Role) ผ่าน API
  const handleRoleChange = async (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    
    try {
      await api.put(`/admin/${id}/role`, { role: newRole });
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์");
      fetchUsers();
    }
  };

  // 3. สลับสถานะ แบน (Ban) ผ่าน API
  const toggleBan = async (id) => {
    const userToUpdate = users.find(u => u.id === id);
    const isBanning = userToUpdate.status === "active";
    
    const confirmMessage = isBanning 
      ? "คุณแน่ใจหรือไม่ว่าต้องการระงับ (Ban) บัญชีผู้ใช้นี้?" 
      : "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกระงับ (Unban) บัญชีผู้ใช้นี้?";

    if (window.confirm(confirmMessage)) {
      const newStatus = isBanning ? "banned" : "active";
      
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));

      try {
        await api.put(`/admin/${id}/status`);
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        fetchUsers(); 
      }
    }
  };

  // 4. ลบผู้ใช้ผ่าน API
  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้? (การกระทำนี้ไม่สามารถย้อนกลับได้)")) {
      try {
        await api.delete(`/admin/${id}`);
        setUsers(users.filter(u => u.id !== id)); 
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการลบผู้ใช้งาน");
      }
    }
  };

  const handlePreviewProfile = (user) => {
    const targetUsername = user.username || user.email.split('@')[0];
    window.open(`/${targetUsername}?source=admin`, '_blank');
  };

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === "All" ? true : (u.role || '').toLowerCase() === filterRole.toLowerCase();
    const matchStatus = filterStatus === "All" ? true : u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-sm border border-slate-50 relative">

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการผู้ใช้งาน (User Management)</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">ดูแลบัญชีผู้ใช้ แบน หรือลบบัญชีที่ทำผิดกฎระบบ</p>
        </div>
        
        <button 
          onClick={() => setIsDownloadModalOpen(true)}
          className="flex items-center gap-2 bg-[#6B46FF] hover:bg-[#5835E5] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors"
        >
          <Download size={18} />
          ดาวน์โหลดรายงาน
        </button>
      </div>

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

      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          
          <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 pb-4 border-b border-slate-100 px-4">
            <div className="text-xs font-bold text-slate-500">ผู้ใช้งาน</div>
            
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 relative cursor-pointer group">
              <span>สิทธิ์ (Role)</span>
              <ChevronDown size={14} className="group-hover:text-slate-700" />
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              >
                <option value="All">ทั้งหมด</option>
                <option value="admin">ADMIN</option>
                <option value="user">USER</option>
              </select>
            </div>

            <div className="text-xs font-bold text-slate-500 text-center">วันที่สมัคร</div>
            
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 relative cursor-pointer group">
              <span>สถานะ</span>
              <ChevronDown size={14} className="group-hover:text-slate-700" />
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              >
                <option value="All">ทั้งหมด</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            
            <div className="text-xs font-bold text-slate-500 text-right">จัดการ</div>
          </div>

          <div className="flex flex-col divide-y divide-slate-50">
            {filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-medium">
                ไม่พบข้อมูลผู้ใช้งานที่ค้นหา
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 py-4 px-4 items-center hover:bg-slate-50/50 transition-colors rounded-xl">
                  
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-slate-200" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border relative ${
                      user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      <span>{user.role.toUpperCase()}</span> 
                      <ChevronDown size={12} />
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      >
                        <option value="admin">ADMIN</option>
                        <option value="user">USER</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 font-medium text-center">
                    {user.date}
                  </div>

                  <div className="flex justify-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                      user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {user.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {user.role !== 'admin' && (
                      <>
                        <button 
                          onClick={() => handlePreviewProfile(user)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                          title="ตรวจสอบโปรไฟล์"
                        >
                          <Eye size={18} strokeWidth={2} />
                        </button>
                        <button 
                          onClick={() => toggleBan(user.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            user.status === 'banned'
                              ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                              : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-red-500'
                          }`}
                          title={user.status === 'banned' ? "ยกเลิกแบน" : "แบนผู้ใช้"}
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

      {/* 2. เรียกใช้ Modal พร้อมส่ง mode="users" ไว้ด้านล่างสุด */}
      {isDownloadModalOpen && (
        <DownloadModal 
          onClose={() => setIsDownloadModalOpen(false)} 
          mode="users" 
        />
      )}

    </div>
  );
}
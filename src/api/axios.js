import axios from 'axios';

// 1. สร้างตัวแปร axios จำลองขึ้นมาพร้อมกับกำหนด URL หลังบ้านไว้เลย
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 2. เขียน Interceptor คอยดักจับ "ขาออก" ทุกครั้งที่มีการยิง API
api.interceptors.request.use(
  (config) => {
    // ดึง Token จากถังความจำใดก็ได้ที่มีข้อมูล
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    // ถ้าเจอ Token ให้แอบเอาไปใส่ที่หัวจดหมาย (Authorization Header) ให้เองอัตโนมัติ
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
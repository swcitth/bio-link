import axios from 'axios';

const api = axios.create({
  // baseURL เหมือนที่อยู่ตั้งต้นเมื่อเรานำไปใช้งานเช่น /user = ที่อยู่ตั้งต้น/user
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 1. Interceptor ขาออก (แนบ Token) จาก front ไป back
// request คือคำขอ (ขาออก)
api.interceptors.request.use(
  (config) => {

    // สร้างตัวแปร token เพื่อรอเก็บบัตรผ่าน
    // sessionStorage ที่เก็บชั่วคราว
    // localStorage ที่เก็ยถาวร
    // บรรทัดนี้เป็นการหา token ที่อยู่ใน sessionStorage หรือ localStorage
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    // ถ้าเจอ token ให้หยิบ config และใส่ข้อมูล token 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Interceptor ขากลับ (ดักจับ Error 401 Token หมดอายุ)
// response คือการตอบกลับ (ขากลับ)
api.interceptors.response.use(
  (response) => {
    // ถ้าผ่าน ให้ส่งข้อมูลไปทำงานต่อปกติ
    return response;
  },
  (error) => {
    // ถ้าเซิร์ฟเวอร์ตอบกลับมาว่า 401 (Unauthorized ไม่มีสิทธิ์ / Token หมดอายุ)
    if (error.response && error.response.status === 401) {
      
      console.warn("Token หมดอายุ หรือไม่มีสิทธิ์เข้าถึง ทำการออกจากระบบอัตโนมัติ");

      // ล้างข้อมูลในกระเป๋าทั้งหมดทิ้ง
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // บอกทุกๆหน้าว่า ข้อมูลในกระเป๋าเปลี่ยนไปแล้วนะ
      window.dispatchEvent(new Event("storage"));

      // บังคับเปลี่ยนหน้าไปที่ /login (ใช้ window.location เพราะอยู่นอก React Component)
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
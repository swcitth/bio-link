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

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // 1. 🌟 เพิ่มบรรทัดนี้: ถ้าเป็นรูป Preview (blob:) ให้รีเทิร์นกลับไปทันที
  if (imagePath.startsWith('blob:')) return imagePath;

  // 2. ล้าง 127.0.0.1 หรือ localhost ออกจาก Database (เผื่อติดมาจากข้อมูลเก่า)
  let cleanPath = imagePath.replace(/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?/, '');

  // 3. ถ้าเป็นลิงก์จริง (http, https) หรือรูป base64 (data:) ให้ส่งกลับไปเลย
  if (cleanPath.startsWith('http') || cleanPath.startsWith('data:')) return cleanPath;

  // 4. ประกอบร่างกับ Base URL จริงของ Production
  let baseUrl = import.meta.env.VITE_API_URL || 'https://apimilink.swceservice.com/api';
  
  // ตัด /api ทิ้ง
  baseUrl = baseUrl.replace(/\/api\/?$/, ''); 

  // เติม https:// ถ้ายังไม่มี
  if (!baseUrl.startsWith('http')) {
    baseUrl = 'https://' + baseUrl;
  }
  
  const prefix = cleanPath.startsWith('/') ? '' : '/';
  return `${baseUrl}${prefix}${cleanPath}`;
};
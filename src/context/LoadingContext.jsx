import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios'; // ⭐️ เปลี่ยนมาใช้ api ของเราแทน axios เดิม
import LoadingScreen from '../components/UI/LoadingScreen';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    // 1. ดักจับ "ขาไป" (Request): เมื่อมีการยิง API ออกไป
    // ⭐️ ใช้ api.interceptors แทน axios
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // เช็คว่าถ้ามีการส่งค่า hideLoading: true มา ให้แอบยิงเงียบๆ ไม่ต้องโชว์ Loading
        if (!config.hideLoading) {
          setGlobalLoading(true);
        }
        return config;
      },
      (error) => {
        setGlobalLoading(false);
        return Promise.reject(error);
      }
    );

    // 2. ดักจับ "ขากลับ" (Response): เมื่อ API โหลดข้อมูลเสร็จ หรือเกิด Error
    // ⭐️ ใช้ api.interceptors แทน axios
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        setGlobalLoading(false);
        return response;
      },
      (error) => {
        setGlobalLoading(false);
        return Promise.reject(error);
      }
    );

    // Cleanup เมื่อออกจากระบบ
    return () => {
      // ⭐️ ใช้ api.interceptors ในการ eject
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ setGlobalLoading }}>
      {globalLoading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
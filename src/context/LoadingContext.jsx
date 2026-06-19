import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import LoadingScreen from '../components/UI/LoadingScreen';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    // 1. ดักจับ "ขาไป" (Request): เมื่อมีการยิง API ออกไป
    const requestInterceptor = axios.interceptors.request.use(
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
    const responseInterceptor = axios.interceptors.response.use(
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
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
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
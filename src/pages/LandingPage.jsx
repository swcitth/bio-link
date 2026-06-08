import React, { useState, useEffect } from 'react';
// 👈 แก้ไข: เปลี่ยนจาก Instagram, Youtube เป็น Camera, Video
import { ArrowRight, Layout, Smartphone, Share2, Video, Camera, ShoppingBag, CheckCircle2, Link2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';

export default function LandingPage() {
  const [showCookie, setShowCookie] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setShowCookie(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const acceptCookie = () => {
    setShowCookie(false);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden relative selection:bg-indigo-200 selection:text-indigo-900"
      style={{ fontFamily: "'Prompt', sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap');
       
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}} />

      <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-purple-200/40 mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-24 lg:pt-20 lg:pb-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        
        <div className="flex-1 space-y-8 text-center lg:text-left max-w-2xl lg:max-w-none mx-auto">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            รวมทุกลิงก์ของคุณ <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              ไว้ในที่เดียว
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            สร้างหน้าโปรไฟล์ลิงก์ที่สวยงาม บ่งบอกความเป็นคุณ เพื่อแชร์โซเชียลมีเดีย ผลงาน หรือร้านค้าของคุณได้ง่ายๆ ในลิงก์เดียว
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 group">
              สร้าง Bio ของคุณ
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> ใช้งานฟรีตลอดชีพ
            </span>
          </div>
        </div>

        <div className="flex-1 relative w-full flex justify-center lg:justify-end">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
         
          <div className={`relative transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="relative w-[300px] h-[600px] bg-white rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-[8px] border-slate-900 overflow-hidden ring-4 ring-slate-100">
             
              <div className="absolute top-0 inset-x-0 h-7 bg-slate-900 rounded-b-3xl w-40 mx-auto z-20 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                <div className="w-12 h-1.5 rounded-full bg-slate-800"></div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 pt-16 flex flex-col items-center overflow-y-auto hide-scrollbar">
                <div className="relative mb-4 group cursor-pointer">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Profile"
                    className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm">
                    <span className="text-xl">✨</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-xl tracking-wide mb-1">มะระ ครีเอเตอร์</h3>
                <p className="text-sm text-slate-500 mb-8 text-center font-medium">ติดตามผลงานของฉันได้ที่นี่ 👇</p>

                <div className="w-full space-y-4">
                  {/* 👈 แก้ไข: ใช้ไอคอน Video แทน Youtube */}
                  <a href="#" className="flex items-center gap-3 bg-white hover:bg-slate-50/80 text-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100/50 backdrop-blur-sm group">
                    <div className="bg-red-100 text-red-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">YouTube Channel</span>
                  </a>

                  {/* 👈 แก้ไข: ใช้ไอคอน Camera แทน Instagram */}
                  <a href="#" className="flex items-center gap-3 bg-white hover:bg-slate-50/80 text-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100/50 backdrop-blur-sm group">
                    <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">Instagram</span>
                  </a>

                  <a href="#" className="flex items-center gap-3 bg-white hover:bg-slate-50/80 text-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100/50 backdrop-blur-sm group">
                    <div className="bg-orange-100 text-orange-500 p-2 rounded-xl group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">สั่งซื้อสินค้า (Shopee)</span>
                  </a>
                </div>

                <div className="mt-auto pt-8 pb-2 flex items-center justify-center gap-1 text-[10px] font-medium text-slate-400">
                  <Link2 className="w-3 h-3" /> Powered by MyBioLink
                </div>
              </div>
            </div>
           
            <div className="absolute -right-6 top-20 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 animate-bounce" style={{animationDuration: '3s'}}>
               <span className="text-2xl">🔥</span>
            </div>
            <div className="absolute -left-8 bottom-32 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 animate-bounce" style={{animationDuration: '4s'}}>
               <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>
      </main>

      <section className="relative z-10 bg-white border-t border-slate-100 pt-20 pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">ทำไมต้องเลือก MyBioLink?</h2>
            <p className="text-slate-500">ฟีเจอร์ครบครัน ใช้งานง่าย ตอบโจทย์ทุกความต้องการของคุณ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50/50 hover:bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Layout className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">ปรับแต่งง่าย</h3>
              <p className="text-slate-600 leading-relaxed">
                มีหลายธีมให้เลือกใช้ เปลี่ยนสี อัปโหลดพื้นหลัง หรือจัดเรียงปุ่มได้ตามสไตล์ของคุณเองอย่างอิสระ
              </p>
            </div>

            <div className="bg-slate-50/50 hover:bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">รองรับมือถือ</h3>
              <p className="text-slate-600 leading-relaxed">
                แสดงผลสวยทุกหน้าจอ ไม่ว่าผู้เยี่ยมชมจะเปิดจากสมาร์ทโฟน แท็บเล็ต หรือคอมพิวเตอร์
              </p>
            </div>

            <div className="bg-slate-50/50 hover:bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Share2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">แชร์ได้ทันที</h3>
              <p className="text-slate-600 leading-relaxed">
                นำลิงก์ไปแปะได้ทุกโซเชียล พร้อม QR Code ในตัวให้คุณดาวน์โหลดไปพิมพ์ หรือแชร์ต่อได้ง่ายดาย
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <CookieBanner 
        showCookie={showCookie} 
        onAccept={acceptCookie} 
        onClose={() => setShowCookie(false)} 
      />

    </div>
  );
}
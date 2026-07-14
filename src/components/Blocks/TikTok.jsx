import { useState, useEffect } from 'react';
import api from "../../api/axios"; 

const TikTok = ({ item, videoUrl, isCompact, blockRadius, ICON_MAP, safeDesign, nameClass, idx, getTiktokId }) => {
  const [tiktokId, setTiktokId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveTiktokUrl = async () => {
      setIsLoading(true);
      let currentUrl = videoUrl;

      // ตรวจสอบว่าเป็นลิงก์ย่อจากมือถือหรือไม่
      if (currentUrl.includes("vt.tiktok.com") || currentUrl.includes("vm.tiktok.com")) {
        try {
          const response = await api.get(`/resolve-tiktok`, {
            params: { url: currentUrl }
          });
          
          // Axios จะเก็บข้อมูลที่ส่งกลับมาไว้ใน .data
          if (response.data && response.data.fullUrl) {
            currentUrl = response.data.fullUrl;
          }
        } catch (error) {
          console.error("Failed to resolve short URL via Axios", error);
        }
      }

      setTiktokId(getTiktokId(currentUrl));
      setIsLoading(false);
    };

    if (videoUrl) {
      resolveTiktokUrl();
    } else {
      setIsLoading(false);
    }
  }, [videoUrl, getTiktokId]);

  const TiktokIcon = ICON_MAP["TikTok"] || ICON_MAP["Link"];

  return (
    <div key={item?.id || idx} className="flex flex-col gap-1">
      <div 
        className="w-full overflow-hidden shadow-md bg-black relative" 
        style={{ aspectRatio: '9/16', maxHeight: isCompact ? '480px' : '600px', borderRadius: blockRadius }}
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center text-white text-sm opacity-70">
             กำลังโหลดวิดีโอ...
          </div>
        ) : tiktokId ? (
          <iframe 
            className="w-full h-full" 
            src={`https://www.tiktok.com/embed/v2/${tiktokId}?lang=th-TH&autoplay=1&mute=1`} 
            title={item?.name || item?.title || "TikTok Video"} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen 
            scrolling="no" 
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center text-white text-center px-2 ${isCompact ? "min-h-[200px]" : "min-h-[300px]"}`}>
            {TiktokIcon && <TiktokIcon size={isCompact ? 32 : 40} className="mb-2 opacity-40" />}
            <p className={`font-bold ${isCompact ? "text-sm" : "text-base"}`}>ยังไม่มีวิดีโอ TikTok</p>
            <p className={`${isCompact ? "text-[10px]" : "text-sm"} opacity-70 mt-1`}>โปรดใส่ลิงก์แบบเต็ม</p>
          </div>
        )}
      </div>
      {(item?.name || item?.title) && (
        <p className={nameClass} style={{ color: safeDesign?.textColor || "#000" }}>
          {item?.name || item?.title}
        </p>
      )}
    </div>
  );
};

export default TikTok;
import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom'; // 🌟 1. นำเข้า ReactDOM สำหรับทำ Portal
import Cropper from 'react-easy-crop';

// ฟังก์ชันช่วยประมวลผลการตัดรูปจาก Canvas ออกมาเป็นไฟล์ใหม่
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
         const newFile = new File([blob], "cropped_image.jpg", { type: "image/jpeg", lastModified: Date.now() });
         resolve({ file: newFile, url: URL.createObjectURL(newFile) });
      }
    }, 'image/jpeg', 0.9);
  });
};

const ImageCropperModal = ({ isOpen, imageSrc, onClose, onCropComplete, aspect = 1, cropShape = "rect" }) => {
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropCompleteData = useCallback((croppedArea, currentCroppedAreaPixels) => {
    setCroppedAreaPixels(currentCroppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการตัดรูป:", error);
    }
  };

  if (!isOpen) return null;

  // 🌟 2. ใช้ ReactDOM.createPortal เพื่อดึง Modal ออกไปวาดที่ชั้นนอกสุดของเบราว์เซอร์
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        
        <div className="p-5 border-b font-bold text-lg text-slate-800 flex justify-between items-center bg-white z-10">
          <span>จัดตำแหน่งรูปภาพ</span>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-all">✕</button>
        </div>
        
        <div className="relative w-full h-[450px] bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={cropPosition}
            zoom={zoomLevel}
            aspect={aspect}
            cropShape={cropShape}
            onCropChange={setCropPosition}
            onCropComplete={handleCropCompleteData}
            onZoomChange={setZoomLevel}
          />
        </div>
        
        <div className="p-6 flex flex-col gap-5 bg-white z-10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-600">ย่อ/ขยาย</span>
            <input
              type="range"
              value={zoomLevel}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoomLevel(e.target.value)}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-2">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors">ยกเลิก</button>
            <button onClick={handleSaveCrop} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
              ยืนยันการตัดรูป
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body // 👈 ระบุให้ไปสร้างที่ Body (นอกสุดของหน้าเว็บ)
  );
};

export default ImageCropperModal;
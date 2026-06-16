import React from 'react';
import { Lock } from 'lucide-react';
import ButtonBig from '../UI/Button/ButtonBig';
import InputField from './InputField';

export default function ResetPasswordForm({ onSubmit }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Texts */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          แก้ไขรหัสผ่าน
        </h1>
        <p className="text-sm text-slate-500">
          กรุณาตั้งรหัสผ่านใหม่ที่ปลอดภัยและคาดเดาได้ยาก
        </p>
      </div>

      {/* Reset Password Form */}
      <form className="flex flex-col gap-5">
        
        {/* ช่องรหัสผ่านใหม่ */}
        <InputField
          id="new-password"
          label="รหัสผ่านใหม่"
          type="password"
          placeholder="••••••••"
          icon={Lock}
        />

        {/* ช่องยืนยันรหัสผ่าน */}
        <InputField
          id="confirm-password"
          label="ยืนยันรหัสผ่าน"
          type="password"
          placeholder="••••••••"
          icon={Lock}
        />

        {/* ปุ่มบันทึก */}
        <ButtonBig type="button" onClick={onSubmit} className="mt-2">
          บันทึก
        </ButtonBig>
      </form>
    </div>
  );
}
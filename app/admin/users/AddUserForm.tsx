"use client";

import { useState, useRef } from "react";
import { addUser } from "./actions";
import PasswordInput from "@/app/components/PasswordInput";
import Modal, { ModalType } from "@/app/components/Modal";

export default function AddUserForm() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: ModalType;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await addUser(formData);

    setLoading(false);

    if (result?.error) {
      setModal({
        isOpen: true,
        title: "เกิดข้อผิดพลาด",
        message: result.error,
        type: "error",
      });
    } else {
      setModal({
        isOpen: true,
        title: "สำเร็จ",
        message: "เพิ่มผู้ใช้งานใหม่เรียบร้อยแล้ว",
        type: "success",
      });
      formRef.current?.reset();
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">เพิ่มผู้ใช้งานใหม่</h2>
        </div>
        <div className="p-6">
          <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่อผู้ใช้ (Username)</label>
              <input
                name="username"
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="กรอกชื่อผู้ใช้"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">รหัสผ่าน (Password)</label>
              <PasswordInput 
                name="password" 
                required 
                placeholder="กรอกรหัสผ่าน" 
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">บทบาท (Role)</label>
              <select 
                name="role" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none"
              >
                <option value="staff">Staff (เจ้าหน้าที่)</option>
                <option value="admin">Admin (ผู้ดูแลระบบ)</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {loading ? "กำลังดำเนินการ..." : "ยืนยันการเพิ่ม"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </>
  );
}

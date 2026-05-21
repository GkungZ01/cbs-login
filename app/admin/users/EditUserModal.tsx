"use client";

import { useState, useEffect } from "react";
import { updateUser } from "./actions";
import PasswordInput from "@/app/components/PasswordInput";
import Modal, { ModalType } from "@/app/components/Modal";
import { User } from "@/lib/types";

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditUserModal({ user, isOpen, onClose }: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await updateUser(formData);

    setLoading(false);

    if (result?.error) {
      setFeedback({
        isOpen: true,
        title: "เกิดข้อผิดพลาด",
        message: result.error,
        type: "error",
      });
    } else {
      setFeedback({
        isOpen: true,
        title: "สำเร็จ",
        message: `แก้ไขข้อมูลผู้ใช้ "${user.username}" เรียบร้อยแล้ว`,
        type: "success",
      });
      // Delay closing the main modal so user can see success feedback if they want, 
      // but usually onClose() is called when the feedback modal is closed.
    }
  }

  const handleFeedbackClose = () => {
    setFeedback({ ...feedback, isOpen: false });
    if (feedback.type === "success") {
      onClose(); // Close the edit modal on success
    }
  };

  if (!isOpen && !feedback.isOpen) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className={`relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}>
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">แก้ไขข้อมูล: {user.username}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="userId" value={user.id} />
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่อผู้ใช้ (Username)</label>
                <input
                  type="text"
                  disabled
                  value={user.username}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed outline-none"
                />
                <p className="mt-1.5 text-xs text-slate-400">ไม่สามารถแก้ไขชื่อผู้ใช้ได้</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">เปลี่ยนรหัสผ่านใหม่ (ระบุเมื่อต้องการเปลี่ยน)</label>
                <PasswordInput 
                  name="password" 
                  placeholder="ปล่อยว่างไว้หากไม่ต้องการเปลี่ยน" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">บทบาท (Role)</label>
                <select 
                  name="role" 
                  defaultValue={user.role}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none"
                >
                  <option value="staff">Staff (เจ้าหน้าที่)</option>
                  <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
                >
                  {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        isOpen={feedback.isOpen}
        onClose={handleFeedbackClose}
        title={feedback.title}
        message={feedback.message}
        type={feedback.type}
      />
    </>
  );
}

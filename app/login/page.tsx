"use client";

import { useActionState, useEffect, useState } from "react";
import { login } from "./actions";
import PasswordInput from "@/app/components/PasswordInput";
import Modal, { ModalType } from "@/app/components/Modal";

export default function LoginPage() {
  // ใช้ useActionState เพื่อจัดการสถานะการส่งฟอร์ม (แนะนำสำหรับ Next.js 15+)
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await login(formData);
    },
    null
  );

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

  // เมื่อมี Error กลับมาจาก Server Action ให้แสดง Modal
  useEffect(() => {
    if (state?.error) {
      setModal({
        isOpen: true,
        title: "เข้าสู่ระบบไม่สำเร็จ",
        message: state.error,
        type: "error",
      });
    }
  }, [state]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div>
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20 text-white font-bold text-3xl">
              C
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">เข้าสู่ระบบ</h2>
            <p className="mt-2 text-center text-sm text-slate-500 font-medium">กรุณากรอกข้อมูลเพื่อเข้าถึงแผงควบคุม</p>
          </div>
          
          {/* เปลี่ยนมาใช้ action แทน onSubmit เพื่อความเสถียรบน IP ที่ไม่ใช่ localhost */}
          <form className="mt-8 space-y-6" action={formAction}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่อผู้ใช้</label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="ชื่อผู้ใช้ของคุณ"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">รหัสผ่าน</label>
                <PasswordInput name="password" required placeholder="รหัสผ่านของคุณ" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex w-full justify-center rounded-xl border border-transparent bg-indigo-600 py-3 px-4 text-sm font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {isPending ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ"}
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

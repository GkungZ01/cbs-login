"use client";

import { useState } from "react";
import { deleteUser } from "./actions";
import Modal, { ModalType } from "@/app/components/Modal";

export default function DeleteUserButton({ userId, username }: { userId: number; username: string }) {
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: ModalType;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showConfirmModal = () => {
    setModal({
      isOpen: true,
      title: "ยืนยันการลบ",
      message: `คุณต้องการลบผู้ใช้ "${username}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      type: "confirm",
      onConfirm: async () => {
        const result = await deleteUser(userId);
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
            message: `ลบผู้ใช้ "${username}" เรียบร้อยแล้ว`,
            type: "success",
          });
        }
      },
    });
  };

  return (
    <>
      <button
        onClick={showConfirmModal}
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        title="ลบผู้ใช้งาน"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        confirmText="ยืนยันการลบ"
        cancelText="ยกเลิก"
      />
    </>
  );
}

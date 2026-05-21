"use client";

import { useState } from "react";
import { User } from "@/lib/types";
import DeleteUserButton from "./DeleteUserButton";
import EditUserModal from "./EditUserModal";

interface UserActionGroupProps {
  user: User;
}

export default function UserActionGroup({ user }: UserActionGroupProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => setIsEditOpen(true)}
        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
        title="แก้ไขผู้ใช้งาน"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      
      <DeleteUserButton userId={user.id} username={user.username} />

      <EditUserModal 
        user={user} 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
      />
    </div>
  );
}

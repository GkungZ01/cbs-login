'use client';

import { deleteUser } from './actions';

export default function DeleteUserButton({ userId, username }: { userId: number, username: string }) {
  async function handleDelete() {
    if (confirm(`คุณต้องการลบผู้ใช้ ${username} ใช่หรือไม่?`)) {
      const result = await deleteUser(userId);
      if (result?.error) {
        alert(result.error);
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900 font-medium"
    >
      ลบ
    </button>
  );
}

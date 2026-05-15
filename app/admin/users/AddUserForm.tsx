'use client';

import { useState, useRef } from 'react';
import { addUser } from './actions';

export default function AddUserForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await addUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      formRef.current?.reset();
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">เพิ่ม User ใหม่</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            name="username"
            type="text"
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="Username"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="Password"
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select name="role" className="w-full border rounded-md px-3 py-2">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition"
        >
          {loading ? 'กำลังเพิ่ม...' : 'เพิ่ม User'}
        </button>
      </form>
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
}

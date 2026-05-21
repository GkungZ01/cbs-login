import db from "@/lib/db";
import AddUserForm from "./AddUserForm";
import UserActionGroup from "./UserActionGroup";
import { User } from "@/lib/types";

export default async function UsersPage() {
  const users = db.prepare("SELECT id, username, role FROM users ORDER BY id DESC").all() as User[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการผู้ใช้งาน</h1>
          <p className="text-slate-500 mt-1">เพิ่ม ลบ และจัดการสิทธิ์การเข้าถึงระบบ</p>
        </div>
      </div>
      
      <AddUserForm />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ลำดับ (ID)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ชื่อผู้ใช้ (Username)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">บทบาท (Role)</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">#{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {user.username[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ring-1 ring-inset ${
                      user.role === "admin" 
                        ? "bg-purple-50 text-purple-700 ring-purple-200" 
                        : "bg-blue-50 text-blue-700 ring-blue-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        user.role === "admin" ? "bg-purple-600" : "bg-blue-600"
                      }`}></span>
                      {user.role === "admin" ? "Admin" : "Staff"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <UserActionGroup user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">ยังไม่มีข้อมูลผู้ใช้งานในระบบ</p>
          </div>
        )}
      </div>
    </div>
  );
}

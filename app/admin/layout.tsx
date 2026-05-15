import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redundant check because of middleware, but good for safety
  if (session?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 text-xl font-bold border-b border-slate-800">
          Admin Panel
        </div>
        <nav className="mt-6">
          <Link
            href="/admin/users"
            className="block py-3 px-6 hover:bg-slate-800 transition"
          >
            จัดการ User
          </Link>
          <Link
            href="/admin/logs"
            className="block py-3 px-6 hover:bg-slate-800 transition"
          >
            ดู Log ระบบ
          </Link>
          <Link
            href="/admin/settings"
            className="block py-3 px-6 hover:bg-slate-800 transition"
          >
            ตั้งค่าระบบ
          </Link>
          <div className="mt-10 border-t border-slate-800 pt-6">
            <Link
              href="/"
              className="block py-3 px-6 text-slate-400 hover:text-white transition"
            >
              ← กลับหน้าแรก
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-700">ยินดีต้อนรับ, {session.username}</h2>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

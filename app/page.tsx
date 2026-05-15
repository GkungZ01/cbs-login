import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { logout } from './login/actions';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold mb-8">หน้าแรก (Home Page)</h1>
      
      <div className="flex gap-4">
        {session?.role === 'admin' && (
          <Link
            href="/admin"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            ไปที่หน้า Admin
          </Link>
        )}
        
        <form action={logout}>
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            ออกจากระบบ
          </button>
        </form>
      </div>

      <div className="mt-8 text-gray-500">
        ยินดีต้อนรับ, {session?.username} ({session?.role})
      </div>
    </div>
  );
}

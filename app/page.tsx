import { getSession } from "@/lib/auth";
import { fetchGateStatus } from "@/lib/gate";
import Link from "next/link";
import { logout } from "./login/actions";
import GateStatusPanel from "./components/GateStatusPanel";

export default async function HomePage() {
  const session = await getSession();
  let initialStatus = null;
  let initialError = null;

  if (session) {
    try {
      initialStatus = await fetchGateStatus(session);
    } catch (err) {
      initialError = err instanceof Error ? err.message : "Failed to load status";
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 gap-8">
      <div className="flex gap-4">
        {session?.role === "admin" && (
          <Link href="/admin" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
            ไปที่หน้า Admin
          </Link>
        )}

        <form action={logout}>
          <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            ออกจากระบบ
          </button>
        </form>
      </div>

      <GateStatusPanel initialStatus={initialStatus} initialError={initialError} />

      {session && (
        <div className="text-gray-500 text-center">
          ยินดีต้อนรับ, {session.username} ({session.role})
        </div>
      )}
    </div>
  );
}

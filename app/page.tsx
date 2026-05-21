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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 h-16 shrink-0 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/20">
              C
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">CBS Lounge Gate</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-bold text-slate-900 leading-none">ยินดีต้อนรับ, {session?.username}</p>
              <span
                className={`text-[10px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded-md ${
                  session?.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                }`}
              >
                {session?.role}
              </span>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              {session?.role === "admin" && (
                <Link
                  href="/admin"
                  className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                >
                  Admin Panel
                </Link>
              )}

              <form action={logout}>
                <button
                  type="submit"
                  className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                >
                  ออกจากระบบ
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 sm:p-12">
          <GateStatusPanel initialStatus={initialStatus} initialError={initialError} />
        </div>
      </main>

      {/* Footer / Info */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} CBS Lounge Gate System. All rights reserved.
      </footer>
    </div>
  );
}

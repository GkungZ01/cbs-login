import db from "@/lib/db";
import { toggleLogs } from "./actions";
import { SystemSetting } from "@/lib/types";

export default async function SettingsPage() {
  const logEnabled = db.prepare("SELECT value FROM settings WHERE key = ?").get("log_enabled") as SystemSetting | undefined;
  const isEnabled = logEnabled?.value === "true";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ตั้งค่าระบบ</h1>
        <p className="text-slate-500 mt-1">จัดการการทำงานพื้นฐานของระบบ</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">การบันทึกกิจกรรม (Logging)</h2>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isEnabled ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0116 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">สถานะการบันทึก Log</h3>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                  เมื่อเปิดใช้งาน ระบบจะทำการบันทึกทุกกิจกรรมที่เกิดขึ้น (Login, การจัดการ User) <br className="hidden md:block" />
                  เพื่อใช้ในการตรวจสอบความปลอดภัยย้อนหลัง
                </p>
              </div>
            </div>
            
            <form action={toggleLogs.bind(null, logEnabled?.value || "false")} className="w-full md:w-auto">
              <button
                type="submit"
                className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg ${
                  isEnabled 
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20" 
                    : "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20"
                }`}
              >
                {isEnabled ? "เปิดใช้งานอยู่" : "ปิดใช้งานอยู่"}
              </button>
            </form>
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-sm text-slate-400 bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0116 0z" />
            </svg>
            <span>การเปลี่ยนแปลงจะมีผลทันทีต่อกิจกรรมถัดไปในระบบ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

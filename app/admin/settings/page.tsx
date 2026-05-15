import db from '@/lib/db';
import { toggleLogs } from './actions';

export default async function SettingsPage() {
  const logEnabled = db.prepare('SELECT value FROM settings WHERE key = ?').get('log_enabled') as { value: string };
  const isEnabled = logEnabled?.value === 'true';

  return (
    <div className="max-w-2xl bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">ตั้งค่าระบบ</h1>
      
      <div className="flex items-center justify-between p-4 border rounded-md">
        <div>
          <h3 className="text-lg font-medium text-gray-900">การบันทึก Log</h3>
          <p className="text-sm text-gray-500">เปิดหรือปิดการบันทึกกิจกรรมต่างๆ ลงในระบบ</p>
        </div>
        
        <form action={toggleLogs.bind(null, logEnabled?.value)}>
          <button
            type="submit"
            className={`px-6 py-2 rounded-full font-medium transition ${
              isEnabled 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {isEnabled ? 'เปิดใช้งานอยู่' : 'ปิดใช้งานอยู่'}
          </button>
        </form>
      </div>
    </div>
  );
}

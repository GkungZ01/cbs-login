"use client";

import Image from "next/image";
import { useState } from "react";

type GateStatus = {
  btn_1?: string;
  btn_2?: string;
};

type GateStatusPanelProps = {
  initialStatus?: GateStatus | null;
  initialError?: string | null;
};

export default function GateStatusPanel({ initialStatus = null, initialError = null }: GateStatusPanelProps) {
  const [status, setStatus] = useState<GateStatus | null>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const getStatus = async (options?: { showLoading?: boolean }) => {
    const showLoading = options?.showLoading ?? true;

    if (showLoading) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const response = await fetch("/api/gate", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to load status");
      }
      const data = (await response.json()) as GateStatus;
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load status");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (value: string) => {
    try {
      const response = await fetch("/api/gate/" + value, {
        method: "GET",
      });
      const data = (await response.json()) as GateStatus;
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const buttonLabel1 = error ? "ERR" : status?.btn_1 || "N/A";
  const buttonLabel2 = error ? "ERR" : status?.btn_2 || "N/A";

  return (
    <div className="flex flex-col gap-8">
      {/* Control Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">สถานะประตูปัจจุบัน</h2>
          <p className="text-sm text-slate-500 font-medium">ควบคุมและตรวจสอบสถานะแบบเรียลไทม์</p>
        </div>
        <button
          className="flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 disabled:opacity-60"
          onClick={() => getStatus({ showLoading: true })}
          disabled={isLoading}
        >
          <svg className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isLoading ? "กำลังโหลด..." : "รีเฟรชสถานะ"}
        </button>
      </div>

      {/* Exit Banner */}
      <div className="bg-rose-50 border border-rose-100 text-rose-700 py-3 rounded-2xl flex items-center justify-center gap-3">
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
        <span className="text-lg font-bold tracking-widest uppercase">EXIT (ทางออก)</span>
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
      </div>

      {/* Gate Interactive Area */}
      <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 aspect-[1280/800]">
        <Image src="/gate.png" alt="Gate System" width={1280} height={800} loading="eager" className="object-cover w-full h-full" />

        {/* Button 1 (Left) */}
        <button
          className={`absolute transform -translate-x-1/2 left-[36%] top-[70%] min-w-25 py-3 rounded-2xl text-lg font-black tracking-wider shadow-2xl transition-all duration-300 active:scale-90 ${
            error
              ? "bg-slate-500 text-white cursor-not-allowed"
              : buttonLabel1 === "open"
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/40 ring-4 ring-emerald-500/20"
                : "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/40 ring-4 ring-rose-500/20"
          } uppercase`}
          onClick={() => !error && updateStatus("0")}
        >
          {buttonLabel1}
        </button>

        {/* Button 2 (Right) */}
        <button
          className={`absolute transform -translate-x-1/2 left-[66%] top-[70%] min-w-25 py-3 rounded-2xl text-lg font-black tracking-wider shadow-2xl transition-all duration-300 active:scale-90 ${
            error
              ? "bg-slate-500 text-white cursor-not-allowed"
              : buttonLabel2 === "open"
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/40 ring-4 ring-emerald-500/20"
                : "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/40 ring-4 ring-rose-500/20"
          } uppercase`}
          onClick={() => !error && updateStatus("1")}
        >
          {buttonLabel2}
        </button>
      </div>

      {/* Entrance Banner */}
      <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 py-3 rounded-2xl flex items-center justify-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        <span className="text-lg font-bold tracking-widest uppercase">ENTRANCE (ทางเข้า)</span>
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-800">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}

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

  const mockStatus = () => {
    setStatus({
      btn_1: "close",
      btn_2: "open",
    });
    setError(null);
  };

  const buttonLabel1 = error ? "ERROR" : status?.btn_1 || "N/A";
  const buttonLabel2 = error ? "ERROR" : status?.btn_2 || "N/A";

  return (
    <>
      <div className="relative flex w-full rounded-lg items-center justify-center py-2">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition disabled:opacity-60"
          onClick={() => {
            // mockStatus();
            getStatus({ showLoading: true });
          }}
          disabled={isLoading}
        >
          {isLoading ? "Reloading..." : "Reload Status"}
        </button>
      </div>

      <p className="text-2xl w-full text-center font-semibold mb-8 px-3 py-2 text-white bg-red-300 rounded-sm">Exit</p>
      <div className="relative flex w-full max-w-7xl rounded-lg items-center self-center shadow-lg">
        <Image src="/gate.png" alt="Description" width={1280} height={800} loading="eager" />
        <button
          className={`absolute transform -translate-x-1/2 left-[39%] top-[70%] text-lg font-bold text-[#EDEEEB] ${error ? "bg-gray-500" : buttonLabel1 == "open" ? "bg-blue-400 hover:bg-blue-500" : "bg-red-400 hover:bg-red-500"} px-4 py-2 rounded-md cursor-pointer uppercase`}
          onClick={() => {
            if (!error) {
              updateStatus("0");
            }
          }}
        >
          {buttonLabel1}
        </button>

        <button
          className={`absolute transform -translate-x-1/2 left-[62%] top-[70%] text-lg font-bold text-[#EDEEEB] ${error ? "bg-gray-500" : buttonLabel2 == "open" ? "bg-blue-400 hover:bg-blue-500" : "bg-red-400 hover:bg-red-500"} px-4 py-2 rounded-md cursor-pointer uppercase`}
          onClick={() => {
            if (error == null) {
              updateStatus("1");
            }
          }}
        >
          {buttonLabel2}
        </button>
      </div>
      <p className="text-2xl w-full text-center font-semibold px-3 py-2 text-gray-600 bg-cyan-200 rounded-sm">Entrance</p>
    </>
  );
}

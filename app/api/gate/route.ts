import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { fetchGateStatus } from "@/lib/gate";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await fetchGateStatus(session);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch gate status" }, { status: 500 });
  }
}

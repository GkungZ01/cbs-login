import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateGateStatus } from "@/lib/gate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ value: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { value } = await params;

    if (value !== "0" && value !== "1") {
      return NextResponse.json({ error: "Invalid gate value. Use 0 or 1." }, { status: 400 });
    }

    const data = await updateGateStatus(session, value);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update gate status" }, { status: 500 });
  }
}

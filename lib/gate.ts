import "server-only";
import * as cheerio from "cheerio";
import { GateStatus, SessionPayload } from "./types";

const API_GATE_URL = process.env.API_GATE;

function validateEnvironment() {
  if (!API_GATE_URL) {
    throw new Error("API_GATE environment variable is not set");
  }
}

export async function fetchGateStatus(session: SessionPayload | null): Promise<GateStatus> {
  if (!session?.username) throw new Error("Unauthorized");
  validateEnvironment();

  const response = await fetch(API_GATE_URL!, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch target page");
  
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const btn1 = $("button.btn1");
  const btn2 = $("button.btn2");

  if (btn1.length === 0 && btn2.length === 0) {
    throw new Error("Could not find expected data on target page");
  }

  return {
    btn_1: btn1.text().trim(),
    btn_2: btn2.text().trim(),
    scrapedAt: new Date().toISOString(),
    requestedBy: session.username,
  };
}

export async function updateGateStatus(session: SessionPayload | null, value: string): Promise<GateStatus> {
  if (!session?.username) throw new Error("Unauthorized");
  validateEnvironment();

  const formData = new FormData();
  formData.append("way", value);

  const response = await fetch(API_GATE_URL!, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to update gate status");

  const html = await response.text();
  const $ = cheerio.load(html);
  
  const btn1 = $("button.btn1");
  const btn2 = $("button.btn2");

  return {
    btn_1: btn1.text().trim(),
    btn_2: btn2.text().trim(),
    scrapedAt: new Date().toISOString(),
    requestedBy: session.username,
  };
}

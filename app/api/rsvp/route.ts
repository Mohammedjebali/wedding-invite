import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "rsvp-data.json");

function readData() {
  if (!existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeData(data: any[]) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST — submit RSVP
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, attending, guests } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const data = readData();
  data.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    phone: phone || "",
    attending: attending || "oui",
    guests: guests || "1",
    createdAt: new Date().toISOString(),
  });
  writeData(data);

  return NextResponse.json({ ok: true });
}

// GET — list all RSVPs
export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

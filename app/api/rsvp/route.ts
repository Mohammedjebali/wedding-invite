import { NextRequest, NextResponse } from "next/server";
import { put, head } from "@vercel/blob";

const BLOB_KEY = "wedding-rsvps.json";

async function readData(): Promise<any[]> {
  try {
    const blob = await head(BLOB_KEY);
    if (!blob) return [];
    const res = await fetch(blob.url);
    return await res.json();
  } catch {
    return [];
  }
}

async function writeData(data: any[]) {
  await put(BLOB_KEY, JSON.stringify(data), { access: "public", contentType: "application/json" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, attending, guests } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const data = await readData();
  data.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    phone: phone || "",
    attending: attending || "oui",
    guests: guests || "1",
    createdAt: new Date().toISOString(),
  });
  await writeData(data);

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

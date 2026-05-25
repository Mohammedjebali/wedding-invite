import { NextRequest, NextResponse } from "next/server";
import { put, list, download } from "@vercel/blob";

const BLOB_PATH = "wedding-rsvps.json";

async function readData(): Promise<any[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (!blobs.length) return [];
    const blob = await download(blobs[0].url);
    const text = await blob.text();
    return JSON.parse(text);
  } catch (e: any) {
    console.error("readData error:", e.message);
    return [];
  }
}

async function writeData(data: any[]) {
  await put(BLOB_PATH, JSON.stringify(data), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function POST(req: NextRequest) {
  try {
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

    return NextResponse.json({ ok: true, total: data.length });
  } catch (e: any) {
    console.error("POST error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("GET error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const dest = (form.get("dest") as string) ?? "images"; // "images" | "audio" | "video"

  if (!file) return Response.json({ error: "No file" }, { status: 400 });

  const dir = path.join(process.cwd(), "public/media", dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const outPath = path.join(dir, file.name);
  fs.writeFileSync(outPath, Buffer.from(bytes));

  return Response.json({ path: `/media/${dest}/${file.name}` });
}

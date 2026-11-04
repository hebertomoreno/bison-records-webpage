import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { putMedia } from "../../../../lib/blob";

const TMP = path.join(os.tmpdir(), "bison-uploads");

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }

  const form = await req.formData();
  const dest = (form.get("dest") as string) ?? "images";

  // Simple single-request upload (admin/uploads and admin/videos dropzones).
  const file = form.get("file") as File | null;
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = await putMedia(`${dest}/${file.name}`, buffer);
    return Response.json({ path: blob.url });
  }

  // Chunked upload (admin/sounds dropzone — keeps large audio files under the
  // serverless request body limit before assembling and uploading to Blob).
  const chunk = form.get("chunk") as File | null;
  const uploadId = form.get("uploadId") as string;
  const chunkIndex = parseInt(form.get("chunkIndex") as string, 10);
  const totalChunks = parseInt(form.get("totalChunks") as string, 10);
  const filename = form.get("filename") as string;

  if (!chunk || !uploadId || !filename) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const tmpDir = path.join(TMP, uploadId);
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(path.join(tmpDir, `chunk-${chunkIndex}`), Buffer.from(await chunk.arrayBuffer()));

  if (chunkIndex === totalChunks - 1) {
    const parts: Buffer[] = [];
    for (let i = 0; i < totalChunks; i++) {
      parts.push(fs.readFileSync(path.join(tmpDir, `chunk-${i}`)));
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });

    const blob = await putMedia(`${dest}/${filename}`, Buffer.concat(parts));
    return Response.json({ done: true, path: blob.url });
  }

  return Response.json({ done: false });
}

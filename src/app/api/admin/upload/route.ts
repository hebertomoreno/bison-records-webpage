import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const TMP = path.join(os.tmpdir(), "bison-uploads");

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }

  const form = await req.formData();
  const chunk = form.get("chunk") as File | null;
  const uploadId = form.get("uploadId") as string;
  const chunkIndex = parseInt(form.get("chunkIndex") as string, 10);
  const totalChunks = parseInt(form.get("totalChunks") as string, 10);
  const filename = form.get("filename") as string;
  const dest = (form.get("dest") as string) ?? "images";

  if (!chunk || !uploadId || !filename) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  // Write this chunk to a temp file
  const tmpDir = path.join(TMP, uploadId);
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(path.join(tmpDir, `chunk-${chunkIndex}`), Buffer.from(await chunk.arrayBuffer()));

  // If all chunks have arrived, assemble the final file
  if (chunkIndex === totalChunks - 1) {
    const destDir = path.join(process.cwd(), "public/media", dest);
    fs.mkdirSync(destDir, { recursive: true });
    const outPath = path.join(destDir, filename);

    const out = fs.createWriteStream(outPath);
    for (let i = 0; i < totalChunks; i++) {
      out.write(fs.readFileSync(path.join(tmpDir, `chunk-${i}`)));
    }
    out.end();
    await new Promise<void>((resolve, reject) => { out.on("finish", resolve); out.on("error", reject); });

    fs.rmSync(tmpDir, { recursive: true, force: true });
    return Response.json({ done: true, path: `/media/${dest}/${filename}` });
  }

  return Response.json({ done: false });
}

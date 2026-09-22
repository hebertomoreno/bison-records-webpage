import { put, type PutBlobResult } from "@vercel/blob";

export function putMedia(pathname: string, body: Buffer | Blob | File): Promise<PutBlobResult> {
  // Explicit token avoids the SDK's default OIDC-first resolution, which fails
  // locally: this project's Blob store only trusts OIDC for Preview/Production,
  // not Development. In actual Preview/Production deploys BLOB_READ_WRITE_TOKEN
  // is unset and this falls through to ambient OIDC automatically.
  return put(pathname, body, {
    access: "public",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

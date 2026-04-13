import { albums } from "../../../../data/albums";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available" }, { status: 403 });
  }
  return Response.json(albums);
}

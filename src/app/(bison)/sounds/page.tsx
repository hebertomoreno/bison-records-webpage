import SoundsClient from "../../../components/SoundsClient";
import "../../../styles/sounds.css";
import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";
import { getTracks } from "../../../lib/db";

export default async function SoundsPage() {
  const locale = await getLocale();
  const tr = t(locale);

  const tracks = getTracks().map((row) => ({
    id: row.id,
    title: row.title,
    artist: row.artist ?? "",
    description: row.description ?? "",
    duration: row.duration,
    recordedAt: row.recorded_at,
    file: row.file,
  }));

  return (
    <div className="sounds-page">
      <h1 className="sounds-heading">{tr.sounds.heading}</h1>
      <p className="sounds-description">{tr.sounds.description}</p>
      <SoundsClient tracks={tracks} />
    </div>
  );
}

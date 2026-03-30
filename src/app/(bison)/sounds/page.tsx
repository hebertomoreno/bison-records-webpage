import SoundsClient from "../../../components/SoundsClient";
import "../../../styles/sounds.css";
import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";
import { tracks } from "../../../data/tracks";

export default async function SoundsPage() {
  const locale = await getLocale();
  const tr = t(locale);
  return (
    <div className="sounds-page">
      <h1 className="sounds-heading">{tr.sounds.heading}</h1>
      <p className="sounds-description">{tr.sounds.description}</p>
      <SoundsClient tracks={tracks} />
    </div>
  );
}

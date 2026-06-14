import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";
import "../../../styles/events.css";

export default async function PressPage() {
  const locale = await getLocale();
  const tr = t(locale).press;

  return (
    <div className="events-page">
      <h1 className="events-heading">{tr.heading}</h1>
      <p className="events-empty">{tr.empty}</p>
    </div>
  );
}

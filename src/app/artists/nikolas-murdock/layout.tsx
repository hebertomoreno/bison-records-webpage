import type { Metadata } from "next";
import NikolasNavbar from "../../../components/NikolasNavbar";
import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";
import "../../../styles/site-layout.css";

export const metadata: Metadata = {
  title: "Nikolas Murdock",
  description: "Official website of Nikolas Murdock",
};

export default async function NikolasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const tr = t(locale);
  const items = [
    { key: "music", label: tr.nikolas.nav.music },
    { key: "about", label: tr.nikolas.nav.about },
    { key: "shows", label: tr.nikolas.nav.shows },
    { key: "videos", label: tr.nikolas.nav.videos },
    { key: "contact", label: tr.nikolas.nav.contact },
  ];

  return (
    <div className="site-layout">
      <NikolasNavbar items={items} />
      <main>{children}</main>
    </div>
  );
}

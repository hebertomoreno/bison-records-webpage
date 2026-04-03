import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getLocale } from "../../lib/locale";
import { t } from "../../lib/translations";
import "../../styles/site-layout.css";

export default async function BisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const tr = t(locale);

  const items = [
    { key: "artists", label: tr.nav.artists },
    { key: "videos", label: tr.nav.videos },
    { key: "sounds", label: tr.nav.sounds },
    { key: "blog", label: tr.nav.blog },
    { key: "events", label: tr.nav.events },
    { key: "press", label: tr.nav.press },
    { key: "contact", label: tr.nav.contact },
  ];

  return (
    <div className="site-layout">
      <Navbar items={items} />
      <main>
        {children}
        <Footer />
      </main>
    </div>
  );
}

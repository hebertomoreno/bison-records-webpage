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
    { key: "photos", label: tr.nikolas.nav.photos },
    { key: "contact", label: tr.nikolas.nav.contact },
  ];

  return (
    <div className="site-layout">
      <NikolasNavbar items={items} />
      <main>
        {children}
        <footer className="nm-footer">
          <div className="nm-footer__inner">
            <a href="https://bisonrecords.co" className="nm-footer__brand">Bison Records</a>
            <nav className="nm-footer__nav">
              <a href="#music">Music</a>
              <a href="#about">Bio</a>
              <a href="#shows">Shows</a>
              <a href="#videos">Videos</a>
              <a href="#contact">Contact</a>
            </nav>
            <a href="mailto:nikolasmurdock@gmail.com" className="nm-footer__email">nikolasmurdock@gmail.com</a>
          </div>
          <p className="nm-footer__rights">© {new Date().getFullYear()} Nikolas Murdock. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { getLocale } from "../lib/locale";
import { t } from "../lib/translations";
import "../styles/footer.css";

export default async function Footer() {
  const locale = await getLocale();
  const tr = t(locale).footer;
  const navTr = t(locale).nav;
  const year = new Date().getFullYear();

  const links = [
    { label: navTr.artists, href: "/artists" },
    { label: navTr.sounds, href: "/sounds" },
    { label: navTr.blog, href: "/blog" },
    { label: navTr.press, href: "/press" },
    { label: navTr.contact, href: "/contact" },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link href="/">
            <Image
              src="/media/images/RecordsLogo.png"
              alt="Bison Records"
              width={160}
              height={55}
              className="site-footer__logo"
            />
          </Link>
          <p className="site-footer__tagline">Ars sola est digna occupatio</p>
        </div>

        <nav className="site-footer__nav">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__contact">
          <p className="site-footer__contact-label">{tr.getInTouch}</p>
          <a href="mailto:info@bisonrecords.com" className="site-footer__email">
            info@bisonrecords.com
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {year} Bison Records. {tr.rights}</p>
      </div>
    </footer>
  );
}

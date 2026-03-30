import Link from "next/link";
import Image from "next/image";
import "../styles/footer.css";

const links = [
  { label: "Artists", href: "/artists" },
  { label: "Sounds", href: "/sounds" },
  { label: "Blog", href: "/blog" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

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
          <p className="site-footer__contact-label">Get in touch</p>
          <a href="mailto:info@bisonrecords.com" className="site-footer__email">
            info@bisonrecords.com
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {year} Bison Records. All rights reserved.</p>
      </div>
    </footer>
  );
}

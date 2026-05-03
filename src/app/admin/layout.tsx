import { notFound } from "next/navigation";
import Link from "next/link";
import "../../styles/admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <html lang="en">
      <head><title>BR Admin</title></head>
      <body>
        <div className="adm-layout">
          <aside className="adm-sidebar">
            <div className="adm-sidebar__brand">Bison Admin</div>
            <nav className="adm-sidebar__nav">
              <Link href="/admin" className="adm-sidebar__link">Dashboard</Link>
              <Link href="/admin/blog" className="adm-sidebar__link">Blog</Link>
              <Link href="/admin/albums" className="adm-sidebar__link">Music</Link>
              <Link href="/admin/videos" className="adm-sidebar__link">Videos</Link>
              <Link href="/admin/events" className="adm-sidebar__link">Events</Link>
              <Link href="/admin/sounds" className="adm-sidebar__link">Sounds</Link>
              <Link href="/admin/uploads" className="adm-sidebar__link">Uploads</Link>
            </nav>
            <div className="adm-sidebar__bottom">
              <a href="/" target="_blank" className="adm-sidebar__site-link">← View site ↗</a>
            </div>
          </aside>
          <main className="adm-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

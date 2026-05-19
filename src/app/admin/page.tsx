import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Dashboard</h1>
      </div>

      <div className="adm-dashboard-grid">
        <Link href="/admin/blog" className="adm-dashboard-card">
          <div className="adm-dashboard-card__icon">✍️</div>
          <div className="adm-dashboard-card__title">Blog</div>
          <div className="adm-dashboard-card__desc">Write and edit blog posts</div>
        </Link>
        <Link href="/admin/albums" className="adm-dashboard-card">
          <div className="adm-dashboard-card__icon">🎵</div>
          <div className="adm-dashboard-card__title">Music</div>
          <div className="adm-dashboard-card__desc">Add descriptions and credits to releases</div>
        </Link>
        <Link href="/admin/videos" className="adm-dashboard-card">
          <div className="adm-dashboard-card__icon">🎬</div>
          <div className="adm-dashboard-card__title">Videos</div>
          <div className="adm-dashboard-card__desc">Manage local and YouTube videos</div>
        </Link>
        <Link href="/admin/events" className="adm-dashboard-card">
          <div className="adm-dashboard-card__icon">📅</div>
          <div className="adm-dashboard-card__title">Events</div>
          <div className="adm-dashboard-card__desc">Add and edit events with dates and images</div>
        </Link>
        <Link href="/admin/sounds" className="adm-dashboard-card">
          <div className="adm-dashboard-card__icon">🔊</div>
          <div className="adm-dashboard-card__title">Sounds</div>
          <div className="adm-dashboard-card__desc">Manage ambient audio tracks</div>
        </Link>
        <Link href="/admin/uploads" className="adm-dashboard-card">
          <div className="adm-dashboard-card__icon">📁</div>
          <div className="adm-dashboard-card__title">Uploads</div>
          <div className="adm-dashboard-card__desc">Upload audio files and images</div>
        </Link>
        <Link href="/admin/artists" className="adm-dashboard-card">
          <div className="adm-dashboard-card__icon">🎤</div>
          <div className="adm-dashboard-card__title">Artists</div>
          <div className="adm-dashboard-card__desc">Add and edit artist profiles and bios</div>
        </Link>
      </div>
    </div>
  );
}

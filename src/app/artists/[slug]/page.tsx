import Link from "next/link";
import { notFound } from "next/navigation";
import { artistProfiles } from "../../../data/artists";
import { upcomingReleases, recentReleases } from "../../../data/releases";
import { getLocale } from "../../../lib/locale";
import "../../../styles/artist-profile.css";

export function generateStaticParams() {
  return artistProfiles.map((a) => ({ slug: a.slug }));
}

export default async function ArtistProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = artistProfiles.find((a) => a.slug === slug);
  if (!artist) notFound();

  const locale = await getLocale();
  const bio = artist.bio[locale];

  const nameLC = artist.name.toLowerCase();
  const upcoming = upcomingReleases.filter((r) => r.artist.toLowerCase().includes(nameLC));
  const recent = recentReleases.filter((r) => r.artist.toLowerCase().includes(nameLC));
  const hasReleases = upcoming.length > 0 || recent.length > 0;

  return (
    <div className="ap-page">
      <div className="ap-photo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artist.image} alt={artist.name} className="ap-photo" />
      </div>
      <div className="ap-content">
        <h1 className="ap-name">{artist.name}</h1>
        {bio && <p className="ap-bio">{bio}</p>}
      </div>

      {hasReleases && (
        <div className="ap-releases">
          {upcoming.length > 0 && (
            <div className="ap-releases__group">
              <h2 className="ap-releases__heading">{locale === "es" ? "Lanzamientos" : "Releases"}</h2>
              <div className="ap-releases__grid">
                {upcoming.map((r) => (
                  <div key={`${r.artist}-${r.title}`} className="ap-release">
                    <Link href={r.href}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image} alt={r.title} className="ap-release__cover" />
                    </Link>
                    <p className="ap-release__title">{r.title}</p>
                    <p className="ap-release__meta">
                      {r.date} <span className="ap-release__type">{r.release_type}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {recent.length > 0 && (
            <div className="ap-releases__group">
              <h2 className="ap-releases__heading">{locale === "es" ? "Lanzamientos" : "Releases"}</h2>
              <div className="ap-releases__grid">
                {recent.map((r) => (
                  <div key={`${r.artist}-${r.title}`} className="ap-release">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.image} alt={r.title} className="ap-release__cover" />
                    <p className="ap-release__title">{r.title}</p>
                    <p className="ap-release__meta">
                      {r.date} <span className="ap-release__type">{r.release_type}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

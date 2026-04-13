import { notFound } from "next/navigation";
import Link from "next/link";
import { albums } from "../../../../../data/albums";
import { albumDetails } from "../../../../../data/album-details";
import "../../../../../styles/nikolas-murdock.css";
import "../../../../../styles/album-detail.css";

export function generateStaticParams() {
  return albums.map((a) => ({ slug: a.spotifyId }));
}

export default async function AlbumDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = albums.find((a) => a.spotifyId === slug);
  if (!album) notFound();

  const detail = albumDetails.find((d) => d.spotifyId === slug);

  return (
    <div className="album-detail">
      <Link href="/artists/nikolas-murdock#music" className="album-detail__back">
        ← Music
      </Link>

      <div className="album-detail__inner">
        <img src={album.image} alt={album.name} className="album-detail__cover" />

        <div className="album-detail__body">
          <p className="album-detail__meta">
            {album.releaseDate.slice(0, 4)}
            <span className="album-detail__type">{album.albumType}</span>
          </p>
          <h1 className="album-detail__title">{album.name}</h1>

          <div className="album-detail__links">
            <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer" className="nm-hero__cta">
              Spotify
            </a>
            {album.appleMusicUrl && (
              <a href={album.appleMusicUrl} target="_blank" rel="noopener noreferrer" className="nm-hero__cta">
                Apple Music
              </a>
            )}
          </div>

          {detail ? (
            <>
              {detail.description && (
                <p className="album-detail__description">{detail.description}</p>
              )}
              {detail.credits.length > 0 && (
                <div className="album-detail__credits">
                  {detail.credits.map((credit) => (
                    <div key={credit.role} className="album-detail__credit">
                      <span className="album-detail__credit-role">{credit.role}</span>
                      <span className="album-detail__credit-names">{credit.names.join(", ")}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="album-detail__description album-detail__description--empty">
              Details coming soon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import "../../../styles/artists.css";
import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";

const artists = [
  {
    name: "Nikolas Murdock",
    slug: "nikolas-murdock",
    image: "/media/images/NikolasMurdockImage.jpg",
  },
];

export default async function ArtistsPage() {
  const locale = await getLocale();
  const tr = t(locale);
  return (
    <div className="artists-page">
      <h1 className="artists-heading">{tr.artists.heading}</h1>
      <div className="artists-grid">
        {artists.map((artist) => (
          <Link
            key={artist.slug}
            href={`/artists/${artist.slug}`}
            className="artist-tile"
            style={{ backgroundImage: `url(${artist.image})` }}
          >
            <div className="artist-tile__overlay" />
            <span className="artist-tile__name">{artist.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

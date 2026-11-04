import Link from "next/link";
import "../../../styles/artists.css";
import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";
import { getArtists } from "../../../lib/artists";

const featured = [
  {
    name: "Nikolas Murdock",
    slug: "nikolas-murdock",
    image: "https://wcmkzak0auav8rzo.public.blob.vercel-storage.com/images/NikolasMurdockImage.jpg",
  },
];

export default async function ArtistsPage() {
  const [locale, artistProfiles] = await Promise.all([getLocale(), getArtists()]);
  const tr = t(locale);
  const artists = [
    ...featured,
    ...artistProfiles.map((a) => ({ name: a.name, slug: a.slug, image: a.image })),
  ];
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

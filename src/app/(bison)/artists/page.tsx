import Link from "next/link";
import "../../../styles/artists.css";

const artists = [
  {
    name: "Nikolas Murdock",
    slug: "nikolas-murdock",
    image: "/media/images/NikolasMurdockImage.jpg",
  },
];

export default function ArtistsPage() {
  return (
    <div className="artists-page">
      <h1 className="artists-heading">Artists</h1>
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

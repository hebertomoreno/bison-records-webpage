import "../../../styles/nikolas-murdock.css";
import { getArtistAlbums, type SpotifyAlbum } from "../../../lib/spotify";
import { getAppleMusicUrls } from "../../../lib/apple-music";
import { getArtistEvents, formatEventDate, type BandsintownEvent } from "../../../lib/bandsintown";

const videoIds = ["dQw4w9WgXcQ", "eY52Zsg-KVI"];

export default async function NikolasMurdockPage() {
  let albums: SpotifyAlbum[] = [];
  let events: BandsintownEvent[] = [];
  let appleMusicUrls: Record<string, string | null> = {};

  try {
    albums = await getArtistAlbums();
    appleMusicUrls = await getAppleMusicUrls(albums.map((a) => a.name));
  } catch {
    // Credentials not set yet — music section will be empty
  }

  try {
    events = await getArtistEvents();
  } catch {
    // Credentials not set yet — shows section will be empty
  }

  return (
    <div className="nm-page">

      {/* ── Hero ── */}
      <section
        id="hero"
        className="nm-hero"
        style={{ backgroundImage: "url(/media/images/NikolasMurdockImage.jpg)" }}
      >
        <div className="nm-hero__content">
          <h1 className="nm-hero__name">Nikolas Murdock</h1>
          <p className="nm-hero__release">Year Of The Brown Bear — Out Now</p>
          <a href="#music" className="nm-hero__cta">Listen Now</a>
        </div>
      </section>

      <div className="nm-divider" />

      {/* ── Music ── */}
      <section id="music">
        <div className="nm-section">
          <h2 className="nm-section__title">Music</h2>
          {albums.length > 0 ? (
            <div className="nm-music-grid">
              {albums.map((album) => (
                <div key={album.id} className="nm-release">
                  <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    className="nm-release__cover"
                  />
                  <p className="nm-release__title">{album.name}</p>
                  <p className="nm-release__year">
                    {album.release_date.slice(0, 4)}
                    <span className="nm-release__type">{album.album_type}</span>
                  </p>
                  <div className="nm-release__links">
                    <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="nm-release__link">
                      Spotify →
                    </a>
                    {appleMusicUrls[album.name] && (
                      <a href={appleMusicUrls[album.name]!} target="_blank" rel="noopener noreferrer" className="nm-release__link">
                        Apple Music →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="nm-music-empty">Music coming soon.</p>
          )}
        </div>
      </section>

      <div className="nm-divider" />

      {/* ── About ── */}
      <section id="about">
        <div className="nm-section">
          <h2 className="nm-section__title">About</h2>
          <div className="nm-about-inner">
            <img
              src="/media/images/NikolasMurdockImage.jpg"
              alt="Nikolas Murdock"
              className="nm-about__photo"
            />
            <p className="nm-about__bio">
              Nikolas Murdock is a singer-songwriter whose music draws from the
              quiet power of the natural world. His debut album,{" "}
              <em>Year Of The Brown Bear</em>, is a meditation on solitude,
              seasons, and the patience of wild things. Recorded live to tape in
              a cabin outside Portland, Oregon, the record captures something
              rare — a voice completely at home in the silence between notes.
            </p>
          </div>
        </div>
      </section>

      <div className="nm-divider" />

      {/* ── Shows ── */}
      <section id="shows">
        <div className="nm-section">
          <h2 className="nm-section__title">Shows</h2>
          {events.length > 0 ? (
            <div className="nm-shows-list">
              {events.map((event) => {
                const ticket = event.offers.find((o) => o.type === "Tickets");
                return (
                  <div key={event.id} className="nm-show">
                    <span className="nm-show__date">{formatEventDate(event.datetime)}</span>
                    <span className="nm-show__venue">
                      {event.venue.name}
                      <span className="nm-show__city">{event.venue.city}, {event.venue.region || event.venue.country}</span>
                    </span>
                    {ticket && (
                      <a href={ticket.url} target="_blank" rel="noopener noreferrer" className="nm-show__ticket">
                        {ticket.status === "sold_out" ? "Sold Out" : "Tickets"}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="nm-music-empty">No upcoming shows.</p>
          )}
        </div>
      </section>

      <div className="nm-divider" />

      {/* ── Videos ── */}
      <section id="videos">
        <div className="nm-section">
          <h2 className="nm-section__title">Videos</h2>
          <div className="nm-videos-grid">
            {videoIds.map((id) => (
              <iframe
                key={id}
                src={`https://www.youtube.com/embed/${id}`}
                allow="accelerometer; autoplay; encrypted-media"
                allowFullScreen
              />
            ))}
          </div>
        </div>
      </section>

      <div className="nm-divider" />

      {/* ── Contact ── */}
      <section id="contact">
        <div className="nm-section">
          <h2 className="nm-section__title">Contact</h2>
          <div className="nm-contact-inner">
            <p className="nm-contact__text">
              For booking, press inquiries, or general correspondence, reach out
              directly.
            </p>
            <a href="mailto:booking@nikolasmurdock.com" className="nm-contact__email">
              booking@nikolasmurdock.com
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

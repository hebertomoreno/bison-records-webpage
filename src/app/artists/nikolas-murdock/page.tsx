import "../../../styles/nikolas-murdock.css";
import { albums } from "../../../data/albums";
import { getArtistEvents, formatEventDate, type BandsintownEvent } from "../../../lib/bandsintown";
import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";
import NikolasHero from "../../../components/NikolasHero";

const videoIds = ["dQw4w9WgXcQ", "eY52Zsg-KVI"];

export default async function NikolasMurdockPage() {
  const locale = await getLocale();
  const tr = t(locale).nikolas;

  let events: BandsintownEvent[] = [];

  try {
    events = await getArtistEvents();
  } catch (err) {
    console.error("[nikolas-murdock] Bandsintown fetch failed:", err);
  }

  return (
    <div className="nm-page">

      {/* ── Hero ── */}
      <NikolasHero release={tr.hero.release} cta={tr.hero.cta} />

      <div className="nm-divider" />

      {/* ── Music ── */}
      <section id="music">
        <div className="nm-section">
          <h2 className="nm-section__title">{tr.sections.music}</h2>
          {albums.length > 0 ? (
            <div className="nm-music-grid">
              {albums.map((album) => (
                <div key={album.spotifyId} className="nm-release">
                  <img
                    src={album.image}
                    alt={album.name}
                    className="nm-release__cover"
                  />
                  <p className="nm-release__title">{album.name}</p>
                  <p className="nm-release__year">
                    {album.releaseDate.slice(0, 4)}
                    <span className="nm-release__type">{album.albumType}</span>
                  </p>
                  <div className="nm-release__links">
                    <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer" className="nm-release__link">
                      Spotify →
                    </a>
                    {album.appleMusicUrl && (
                      <a href={album.appleMusicUrl} target="_blank" rel="noopener noreferrer" className="nm-release__link">
                        Apple Music →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="nm-music-empty">{tr.music.empty}</p>
          )}
        </div>
      </section>

      <div className="nm-divider" />

      {/* ── About ── */}
      <section id="about">
        <div className="nm-section">
          <h2 className="nm-section__title">{tr.sections.about}</h2>
          <div className="nm-about-inner">
            <img
              src="/media/images/NikolasMurdockImage.jpg"
              alt="Nikolas Murdock"
              className="nm-about__photo"
            />
            <div className="nm-about__bio">
              {tr.about.bio.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="nm-divider" />

      {/* ── Shows ── */}
      <section id="shows">
        <div className="nm-section">
          <h2 className="nm-section__title">{tr.sections.shows}</h2>
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
                        {ticket.status === "sold_out" ? tr.shows.soldOut : tr.shows.tickets}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="nm-music-empty">{tr.shows.empty}</p>
          )}
        </div>
      </section>

      <div className="nm-divider" />

      {/* ── Videos ── */}
      <section id="videos">
        <div className="nm-section">
          <h2 className="nm-section__title">{tr.sections.videos}</h2>
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
          <h2 className="nm-section__title">{tr.sections.contact}</h2>
          <div className="nm-contact-inner">
            <p className="nm-contact__text">{tr.contact.text}</p>
            <a href="mailto:nikolasmurdock@gmail.com" className="nm-contact__email">
              nikolasmurdock@gmail.com
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

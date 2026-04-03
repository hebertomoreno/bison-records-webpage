import Link from "next/link";
import { events } from "../../../data/events";
import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";
import "../../../styles/events.css";

export default async function EventsPage() {
  const locale = await getLocale();
  const tr = t(locale).events;

  return (
    <div className="events-page">
      <h1 className="events-heading">{tr.heading}</h1>

      {events.length === 0 ? (
        <p className="events-empty">{tr.empty}</p>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <article key={event.id} className="event-card">
              <div className="event-card__main-image-wrap">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-card__main-image"
                />
              </div>

              <div className="event-card__body">
                <div className="event-card__dates">
                  {event.dates.map((d) => (
                    <span key={d} className="event-card__date">{d}</span>
                  ))}
                </div>

                <h2 className="event-card__title">{event.title}</h2>
                <p className="event-card__description">{event.description}</p>

                {event.images.length > 0 && (
                  <div className="event-card__sub-images">
                    {event.images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${event.title} ${i + 1}`}
                        className="event-card__sub-image"
                      />
                    ))}
                  </div>
                )}

                {event.blogSlug && (
                  <Link href={`/blog/${event.blogSlug}`} className="event-card__blog-link">
                    {tr.readPost} →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

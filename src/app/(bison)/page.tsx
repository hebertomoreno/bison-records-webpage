import Hero from "../../components/Hero";
import "../../styles/home.css";
import { getUpcomingReleases, getRecentReleases, type ReleaseRow as Release } from "../../lib/db";

function ReleaseGrid({ heading, releases, empty }: { heading: string; releases: Release[]; empty: string }) {
  return (
    <section className="upcoming">
      <h2 className="upcoming__heading">{heading}</h2>
      {releases.length > 0 ? (
        <div className="upcoming__grid">
          {releases.map((release) => (
            <div key={`${release.artist}-${release.title}`} className="upcoming__release">
              <img src={release.image} alt={release.title} className="upcoming__cover" />
              <p className="upcoming__title">{release.title}</p>
              <p className="upcoming__artist">{release.artist}</p>
              <p className="upcoming__release-type">{release.release_type}</p>
              <p className="upcoming__date">{release.date}</p>
              <a href={release.href} className="upcoming__link">Learn More</a>
            </div>
          ))}
        </div>
      ) : (
        <p className="upcoming__empty">{empty}</p>
      )}
    </section>
  );
}

export default async function HomePage() {
  const upcomingReleases = getUpcomingReleases();
  const recentReleases = getRecentReleases();

  return (
    <div className="home-page">
      <Hero />
      <div className="home-releases">
        <ReleaseGrid
          heading="Recent Releases"
          releases={recentReleases}
          empty="No recent releases."
        />
        <div className="home-releases__divider" />
        <ReleaseGrid
          heading="Upcoming Releases"
          releases={upcomingReleases}
          empty="No upcoming releases."
        />
      </div>
    </div>
  );
}

import Hero from "../../components/Hero";
import "../../styles/home.css";
import { getUpcomingReleases, getRecentReleases, type ReleaseRow as Release } from "../../lib/db";
import { getLocale } from "../../lib/locale";
import { t } from "../../lib/translations";

function ReleaseGrid({
  heading,
  releases,
  empty,
  learnMore,
}: {
  heading: string;
  releases: Release[];
  empty: string;
  learnMore: string;
}) {
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
              <a href={release.href} className="upcoming__link">{learnMore}</a>
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
  const [locale, upcomingReleases, recentReleases] = await Promise.all([
    getLocale(),
    Promise.resolve(getUpcomingReleases()),
    Promise.resolve(getRecentReleases()),
  ]);
  const { hero: heroTr, releases: releasesTr } = t(locale);

  const slides = [
    {
      video: "/media/video/hero1",
      title: "Bison Records",
      subtitle: "Ars sola est digna occupatio",
      tagline: heroTr.tagline,
      buttons: [{ label: heroTr.ourArtists, href: "/artists" }],
    },
    {
      image: "/media/images/bear1.jpg",
      artist: "Nikolas Murdock's",
      title: "Year Of The Brown Bear",
      subtitle: heroTr.nikolasSubtitle,
      buttons: [{ label: heroTr.nikolasButton, href: "/artists/nikolas-murdock" }],
    },
  ];

  return (
    <div className="home-page">
      <Hero slides={slides} />
      <div className="home-releases">
        <ReleaseGrid
          heading={releasesTr.recent}
          releases={recentReleases}
          empty={releasesTr.noRecent}
          learnMore={releasesTr.learnMore}
        />
        <div className="home-releases__divider" />
        <ReleaseGrid
          heading={releasesTr.upcoming}
          releases={upcomingReleases}
          empty={releasesTr.noUpcoming}
          learnMore={releasesTr.learnMore}
        />
      </div>
    </div>
  );
}

import Hero from "../../components/Hero";
import SideNavLink from "../../components/SideNavLink";
import SomewhereButton from "../../components/SomewhereButton";
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
              <a href={release.href}><img src={release.image} alt={release.title} className="upcoming__cover" /></a>
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
  const { hero: heroTr, releases: releasesTr, nav: navTr } = t(locale);

  const leftNav = [
    { href: "/artists", label: navTr.artists, video: "/media/video/Landscapes/landscape1-opt.mp4" },
    { href: "/videos", label: navTr.videos, video: "/media/video/Landscapes/landscape2-opt.mp4" },
    { href: "/sounds", label: navTr.sounds, video: "/media/video/Landscapes/landscape3-opt.mp4" },
  ];

  const rightNav = [
    { href: "/blog", label: navTr.blog, video: "/media/video/Landscapes/landscape4-opt.mp4" },
    { href: "/events", label: navTr.events, video: "/media/video/Landscapes/landscape5-opt.mp4" },
    { href: "/press", label: navTr.press, video: "/media/video/Landscapes/landscape6-opt.mp4" },
  ];

  const slides = [
    {
      video: "/media/video/hero1",
      logo: "/media/images/RecordsLogo.png",
      title: "Bison Records",
      subtitle: "Ars sola est digna occupatio",
      tagline: heroTr.tagline,
      buttons: [{ label: heroTr.ourArtists, href: "/artists" }],
    },
    {
      image: "/media/images/bear1.jpg",
      logo: "/media/images/NikMDkLogo.png",
      title: "Year Of The Brown Bear",
      subtitle: heroTr.nikolasSubtitle,
      buttons: [{ label: heroTr.nikolasButton, href: "/artists/nikolas-murdock" }],
    },
  ];

  return (
    <div className="home-page">
      <div className="hero-wrapper">
        <nav className="hero-sidenav">
          {leftNav.map((item) => (
            <SideNavLink key={item.href} href={item.href} label={item.label} videoSrc={item.video} />
          ))}
        </nav>
        <div className="hero-main">
          <Hero slides={slides} />
        </div>
        <nav className="hero-sidenav">
          {rightNav.map((item) => (
            <SideNavLink key={item.href} href={item.href} label={item.label} videoSrc={item.video} />
          ))}
        </nav>
      </div>
      <SomewhereButton />
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

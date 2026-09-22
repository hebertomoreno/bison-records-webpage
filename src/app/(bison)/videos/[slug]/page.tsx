import { notFound } from "next/navigation";
import Link from "next/link";
import { getVideos } from "../../../../lib/videos";
import { getLocale } from "../../../../lib/locale";
import { t } from "../../../../lib/translations";
import "../../../../styles/videos.css";

export async function generateStaticParams() {
  const videos = await getVideos();
  return videos
    .filter((v) => v.type === "local")
    .map((v) => ({ slug: v.id }));
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [videos, locale] = await Promise.all([getVideos(), getLocale()]);
  const video = videos.find((v) => v.id === slug && v.type === "local");

  if (!video) notFound();

  const tr = t(locale);
  const isPortrait = video.id === "facesplaces";

  return (
    <div className="video-detail">
      <Link href="/videos" className="video-detail__back">
        ← {tr.videos.heading}
      </Link>

      <video
        className={`video-detail__player${isPortrait ? " video-detail__player--portrait" : ""}`}
        controls
        playsInline
        preload="metadata"
      >
        {video.fileWebmUrl && <source src={video.fileWebmUrl} type="video/webm" />}
        {video.fileMp4Url && <source src={video.fileMp4Url} type="video/mp4" />}
      </video>

      <h1 className="video-detail__title">{video.title}</h1>
      <p className="video-detail__author">{video.author}</p>
      <p className="video-detail__description">{video.description}</p>
    </div>
  );
}

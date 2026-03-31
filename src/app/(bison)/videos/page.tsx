import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { videos } from "../../../data/videos";
import { getLocale } from "../../../lib/locale";
import { t } from "../../../lib/translations";
import "../../../styles/videos.css";

function youtubeThumbnail(id: string) {
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

export default async function VideosPage() {
  const locale = await getLocale();
  const tr = t(locale).videos;

  return (
    <div className="videos-page">
      <h1 className="videos-heading">{tr.heading}</h1>
      <p className="videos-description">{tr.description}</p>

      <div className="videos-list">
        {videos.map((video) => {
          const isPortrait = video.id === "facesplaces";
          const thumbClass = `video-thumb-wrap${isPortrait ? " video-thumb-wrap--portrait" : ""}`;
          const thumbSrc = video.type === "youtube"
            ? youtubeThumbnail(video.youtubeId!)
            : video.preview;
          const href = video.type === "youtube"
            ? `https://www.youtube.com/watch?v=${video.youtubeId}`
            : `/videos/${video.id}`;
          const isExternal = video.type === "youtube";

          return (
            <a
              key={video.id}
              href={href}
              className="video-row"
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className={thumbClass}>
                {thumbSrc && (
                  <img src={thumbSrc} alt={video.title} className="video-thumb" />
                )}
              </span>

              <span className="video-info">
                <span className="video-title">{video.title}</span>
                <span className="video-author">{video.author}</span>
                <span className="video-description">{video.description}</span>
                {isExternal && (
                  <span className="video-badge">
                    <FiExternalLink size={11} style={{ display: "inline", marginRight: 4 }} />
                    {tr.watch}
                  </span>
                )}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

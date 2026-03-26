const videoIds = [
  "dQw4w9WgXcQ",
  "eY52Zsg-KVI",
  "3fumBcKC6RE",
];

export default function VideosPage() {
  return (
    <div className="space-y-8" style={{ paddingTop: "8rem" }}>
      {videoIds.map((id) => (
        <iframe
          key={id}
          className="w-full aspect-video rounded shadow"
          src={`https://www.youtube.com/embed/${id}`}
          allow="accelerometer; autoplay; encrypted-media"
          allowFullScreen
        />
      ))}
    </div>
  );
}

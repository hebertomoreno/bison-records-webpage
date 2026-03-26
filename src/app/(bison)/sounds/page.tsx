import SoundsClient, { type Track } from "../../../components/SoundsClient";
import "../../../styles/sounds.css";

// Add your tracks here — drop audio files into /public/media/audio/
const tracks: Track[] = [
  {
    id: "year-of-the-brown-bear",
    title: "Year Of The Brown Bear",
    artist: "Nikolas Murdock",
    duration: "4:12",
    file: "/media/audio/year-of-the-brown-bear.mp3",
  },
  {
    id: "november-fifth",
    title: "November Fifth",
    artist: "Nikolas Murdock",
    duration: "3:47",
    file: "/media/audio/november-fifth.mp3",
  },
  {
    id: "v-for-vendetta",
    title: "V For Vendetta",
    artist: "Nikolas Murdock",
    duration: "5:03",
    file: "/media/audio/v-for-vendetta.mp3",
  },
];

export default function SoundsPage() {
  return (
    <div className="sounds-page">
      <h1 className="sounds-heading">Sounds</h1>
      <SoundsClient tracks={tracks} />
    </div>
  );
}

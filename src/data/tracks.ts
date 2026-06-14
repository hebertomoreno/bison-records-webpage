export interface Track {
  id: string;
  file: string;
  title: string;
  artist: string;
  description: string;
  duration: string | null;
  recordedAt: string | null;
  hidden?: boolean;
}

// ── Edit tracks here (or run `npm run scan-audio` to regenerate) ────

export const tracks: Track[] = [
  {
    id: "denverriver1",
    file: "/media/audio/DenverRiver1.wav",
    title: "Quiet River",
    artist: "Heberto Moreno",
    description: "First time I went to the Rockies, I was in Denver for work. I rented a Toyota 4Runner and drove to the rockies. Of course, at first I had rented another car and had a lot of trouble getting them to accept my credit card. The lady all but accused me of fraud. I went next door and thankfully they had a beautiful, big 4runner available for rent. The drive to The Rockies is one of my favorites.",
    duration: "0:31",
    recordedAt: "The Rocky Mountains, near Denver.",
  },
  {
    id: "denverriver2",
    file: "/media/audio/DenverRiver2.wav",
    title: "A Louder River",
    artist: "Heberto Moreno",
    description: "After recording Quiet River, I increased the volume in the recorder to get this recording. I know, I'm so smart.",
    duration: "0:34",
    recordedAt: "The Rocky Mountains, near Denver.",
  },
  {
    id: "lake-water",
    file: "/media/audio/Lake Water.wav",
    title: "Water sounds from the shore of a lake in Vancouver Island",
    artist: "Heberto Moreno",
    description: "I camped at the shores of Upper Campbell Lake, up near Campbell River, in Vancouver Island. I drove an old RAV4 with a tent on the roof. I took off my shoes and put the Zoom H4n Pro real close to the water for this one. Great time, great time.",
    duration: "0:37",
    recordedAt: "Near Campbell River, Vancouver Island.",
  },
  {
    id: "thesea1",
    file: "/media/audio/TheSea1.wav",
    title: "Sea Recording 1",
    artist: "Heberto Moreno",
    description: "I love taking recordings of the sea. I love taking video of the sea too, even if I've seen it before. This must have been a beach in Jalisco.",
    duration: "0:18",
    recordedAt: "A beach in Jalisco. Maybe PV?",
  },
  {
    id: "thesea2",
    file: "/media/audio/TheSea2.wav",
    title: "Sea Recording 2",
    artist: "Heberto Moreno",
    description: "Everyone: One more sea. One more sea. One more sea!",
    duration: "1:57",
    recordedAt: "A beach in Jalisco. Maybe PV?",
  },
  {
    id: "icy-strait-point-forest",
    file: "/media/audio/IcyStraitPoint.wav",
    title: "Icy Strait Point Forest",
    artist: "Heberto Moreno",
    description: "When me and the wife went on a cruise through Alaska, Icy Strait Point was the last stop before where we would be getting off. There, we walked through a big forest with very tall trees, with gondolas going up and down a cable in the middle of it. It reminded me of the forest in Return of the Jedi. \nI stood five minutes with my phone held out to record some of the ambience. Definitely got some people walking through, the low rumble of the cruise ship motors (there was another one docked on the other side of the forest) and the gondolas going by. ",
    duration: "5:04",
    recordedAt: "Icy Strait Point, AK. ",
  },
];

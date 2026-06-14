export interface ArtistProfile {
  slug: string;
  name: string;
  image: string;
  bio: { en: string; es: string };
}

export const artistProfiles: ArtistProfile[] = [
  {
    slug: "nube-render",
    name: "Nube Render",
    image: "/media/images/NubeRender.jpg",
    bio: {
      en: `Nube Render began in 2021. It is a sound project by Diego Ortega, a digital artist from Toluca. His production spans genres ranging from trap to hyperpop. In 2024 he released his debut single Río Lerma feat. OZOZOZ on Spotify through Bison Records.`,
      es: `Nube render, comenzó en 2021. Es un proyecto sonoro de Diego Ortega, artista digital de Toluca. Su producción implica géneros que van desde el trap hasta el hyperpop. En 2024 publicó su primer single Río Lerma feat OZOZOZ en spotify a través de Bison Records.`,
    },
  },
];

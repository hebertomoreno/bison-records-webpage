export const translations = {
  en: {
    nav: {
      artists: "Artists",
      videos: "Videos",
      sounds: "Sounds",
      blog: "Blog",
      events: "Events",
      press: "Press",
      contact: "Contact",
    },
    artists: {
      heading: "Artists",
    },
    sounds: {
      heading: "Sounds",
      description:
        "Sounds recorded by the Bison Records team, and friends. They are free for download and use in your projects.",
    },
    videos: {
      heading: "Videos",
      description: "Music videos, short films, and visual works from the Bison Records family.",
      watch: "Watch on YouTube",
    },
    blog: {
      heading: "Blog",
      back: "← All Posts",
      by: "by",
    },
    events: {
      heading: "Events",
      empty: "No upcoming events.",
      readPost: "Read the post",
    },
    hero: {
      tagline: "Since 2014",
      ourArtists: "Our Artists",
      nikolasSubtitle: "November 5th, 2026",
      nikolasButton: "Who's Nikolas Murdock?",
    },
    footer: {
      getInTouch: "Get in touch",
      rights: "All rights reserved.",
    },
    releases: {
      recent: "Recent Releases",
      upcoming: "Upcoming Releases",
      learnMore: "Learn More",
      noRecent: "No recent releases.",
      noUpcoming: "No upcoming releases.",
    },
    nikolas: {
      nav: {
        music: "Music",
        about: "Bio",
        shows: "Shows",
        videos: "Videos",
        photos: "Photos",
        contact: "Contact",
      },
      hero: {
        release: "Year Of The Brown Bear — Coming November 2026",
        cta: "Listen Now",
      },
      sections: {
        music: "Music",
        about: "Bio",
        shows: "Shows",
        videos: "Videos",
        photos: "Photos",
        contact: "Contact",
      },
      music: {
        empty: "Music coming soon.",
      },
      releases: {
        upcoming: "Upcoming",
        recent: "Recent",
      },
      about: {
        bio: "Singer-songwriter, multi-instrumentalist and producer Heberto Moreno makes music under the moniker Nikolas Murdock. Hailing from Sonora, but with homes in all sorts of places and currently based in Guadalajara, Jalisco, his experiences throughout Mexico have fueled a deep desire to communicate with storms of sound. With a profoundly DIY approach, Moreno has managed to capture deeply melancholic sensibilities while creating catchy, complicated songs with danceable melodies.\n\nIn 2016 he traveled to Valle de Bravo, Estado de México to record his second album Resilience in a cabin in the middle of the woods. The result from this can be heard in the end product, where the low-budget production shines through with hard hitting lyrics and fun rhythms.\n\nHis most recent efforts in the form of three singles released one month apart in 2021 showcase his talents as a songwriter, producer and mixing engineer. Produced and mixed in his home studio, Monóxido, Insightful and Reincarnation 2021 are logical next steps for an artist that is in search of constantly improving his craft.",
      },
      shows: {
        empty: "No upcoming shows.",
        soldOut: "Sold Out",
        tickets: "Tickets",
      },
      contact: {
        text: "For booking, press inquiries, or general correspondence, reach out directly.",
      },
    },
  },
  es: {
    nav: {
      artists: "Artistas",
      videos: "Videos",
      sounds: "Sonidos",
      blog: "Blog",
      events: "Eventos",
      press: "Prensa",
      contact: "Contacto",
    },
    artists: {
      heading: "Artistas",
    },
    sounds: {
      heading: "Sonidos",
      description:
        "Sonidos grabados por el equipo de Bison Records y amigos. Son de descarga gratuita y puedes usarlos en tus proyectos.",
    },
    videos: {
      heading: "Videos",
      description: "Videoclips, cortometrajes y obras visuales del equipo de Bison Records.",
      watch: "Ver en YouTube",
    },
    blog: {
      heading: "Blog",
      back: "← Todas las entradas",
      by: "por",
    },
    events: {
      heading: "Eventos",
      empty: "Sin eventos próximos.",
      readPost: "Leer la entrada",
    },
    hero: {
      tagline: "Desde 2014",
      ourArtists: "Nuestros Artistas",
      nikolasSubtitle: "5 de noviembre, 2026",
      nikolasButton: "¿Quién es Nikolas Murdock?",
    },
    footer: {
      getInTouch: "Contáctanos",
      rights: "Todos los derechos reservados.",
    },
    releases: {
      recent: "Lanzamientos Recientes",
      upcoming: "Próximos Lanzamientos",
      learnMore: "Ver más",
      noRecent: "Sin lanzamientos recientes.",
      noUpcoming: "Sin próximos lanzamientos.",
    },
    nikolas: {
      nav: {
        music: "Música",
        about: "Bio",
        shows: "Fechas",
        videos: "Videos",
        photos: "Fotos",
        contact: "Contacto",
      },
      hero: {
        release: "Year Of The Brown Bear — Noviembre 2026",
        cta: "Escuchar",
      },
      sections: {
        music: "Música",
        about: "Bio",
        shows: "Fechas",
        videos: "Videos",
        photos: "Fotos",
        contact: "Contacto",
      },
      music: {
        empty: "Música próximamente.",
      },
      releases: {
        upcoming: "Próximos",
        recent: "Recientes",
      },
      about: {
        bio: "El cantautor, multi-instrumentista y productor Heberto Moreno hace música bajo el seudónimo Nikolas Murdock. Originario de Sonora, pero con hogares en múltiples lugares y actualmente radicado en Guadalajara, Jalisco, sus experiencias a lo largo de México han alimentado un profundo deseo de comunicarse a través de tormentas de sonido. Con un enfoque profundamente DIY, Moreno ha logrado capturar sensibilidades melancólicas mientras crea canciones pegadizas y complejas con melodías bailables.\n\nEn 2016 viajó a Valle de Bravo, Estado de México, para grabar su segundo álbum Resilience en una cabaña en medio del bosque. El resultado se escucha en el producto final, donde la producción de bajo presupuesto brilla con letras contundentes y ritmos divertidos.\n\nSus esfuerzos más recientes, en forma de tres sencillos lanzados con un mes de diferencia en 2021, muestran sus talentos como compositor, productor e ingeniero de mezcla. Producidos y mezclados en su estudio casero, Monóxido, Insightful y Reincarnation 2021 son pasos lógicos para un artista en constante búsqueda de mejorar su oficio.",
      },
      shows: {
        empty: "No hay próximas fechas.",
        soldOut: "Agotado",
        tickets: "Entradas",
      },
      contact: {
        text: "Para reservas, consultas de prensa o correspondencia general, escríbenos directamente.",
      },
    },
  },
} as const;

export type Locale = keyof typeof translations;

export function t(locale: Locale) {
  return translations[locale];
}

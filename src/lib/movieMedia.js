const POSTER_FALLBACK = "https://placehold.co/400x600/e9ecef/495057?text=Sin+poster";
const SYNOPSIS_FALLBACK = {
  es: "Sinopsis no disponible.",
  en: "Synopsis not available.",
};

export const getPosterUrl = (movie) => {
  const poster =
    movie?.poster || movie?.posterUrl || movie?.poster_url || movie?.imagen || movie?.image;

  if (typeof poster === "string" && poster.trim()) {
    return poster.trim();
  }

  return POSTER_FALLBACK;
};

export const getPosterAlt = (movie, language = "es") => {
  if (language === "en") {
    return `Poster for ${getMovieTitle(movie, language)}`;
  }

  return `Póster de ${getMovieTitle(movie, language)}`;
};

export const getMovieTitle = (movie, language = "es") => {
  const title = language === "en" ? movie?.title || movie?.titulo : movie?.titulo || movie?.title;

  if (typeof title === "string" && title.trim()) {
    return title.trim();
  }

  return language === "en" ? "Untitled movie" : "Película sin título";
};

export const getMovieGenres = (movie, language = "es") => {
  const genres = language === "en" ? movie?.genres || movie?.generos : movie?.generos || movie?.genres;

  if (Array.isArray(genres)) {
    return genres.filter((genre) => typeof genre === "string" && genre.trim());
  }

  return [];
};

export const getMovieDirector = (movie, language = "es") => {
  const director = language === "en" ? movie?.director_en || movie?.director : movie?.director;

  if (typeof director === "string" && director.trim()) {
    return director.trim();
  }

  return language === "en" ? "Unknown director" : "Dirección desconocida";
};

export const getSynopsis = (movie, language = "es") => {
  const synopsis =
    language === "en"
      ? movie?.synopsis || movie?.sinopsis_en || movie?.sinopsis || movie?.description
      : movie?.sinopsis || movie?.synopsis_es || movie?.synopsis || movie?.descripcion;

  if (typeof synopsis === "string" && synopsis.trim()) {
    return synopsis.trim();
  }

  return SYNOPSIS_FALLBACK[language] || SYNOPSIS_FALLBACK.es;
};

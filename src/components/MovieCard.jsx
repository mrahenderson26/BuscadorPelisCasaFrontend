import { Link } from "react-router-dom";
import {
  getMovieDirector,
  getMovieGenres,
  getMovieTitle,
  getPosterAlt,
  getPosterUrl,
  getSynopsis,
} from "../lib/movieMedia.js";

function MovieCard({ movie, language, text }) {
  const genres = getMovieGenres(movie, language);
  const detailPath = language === "en" ? `/movie/${movie.id}` : `/pelicula/${movie.id}`;

  return (
    <article className="card shadow-sm h-100 movie-card">
      <img
        src={getPosterUrl(movie)}
        className="card-img-top movie-poster"
        alt={getPosterAlt(movie, language)}
        loading="lazy"
      />
      <div className="card-body">
        <h2 className="h5 card-title mb-2">{getMovieTitle(movie, language)}</h2>
        <p className="mb-1 text-muted">{getMovieDirector(movie, language)}</p>
        <p className="mb-3">
          <span className="badge text-bg-light me-2">{movie.año}</span>
          <span className="badge text-bg-warning">{movie.puntuacion}/10</span>
        </p>
        <p className="mb-3 small">{genres.join(" - ")}</p>
        <p className="mb-3 small text-secondary movie-synopsis">{getSynopsis(movie, language)}</p>
        <Link className="btn btn-outline-primary btn-sm" to={detailPath}>
          {text.viewDetail}
        </Link>
      </div>
    </article>
  );
}

export default MovieCard;

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { deleteMovie, fetchMovieById } from "../lib/api.js";
import {
  getMovieDirector,
  getMovieGenres,
  getMovieTitle,
  getPosterAlt,
  getPosterUrl,
  getSynopsis,
} from "../lib/movieMedia.js";
import { getText } from "../lib/i18n.js";

function MovieDetailPage({ language, onLanguageChange }) {
  const text = getText(language);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const expectedPath = language === "en" ? `/movie/${id}` : `/pelicula/${id}`;

    if (location.pathname !== expectedPath) {
      navigate(expectedPath, { replace: true });
    }
  }, [id, language, location.pathname, navigate]);

  useEffect(() => {
    let cancelled = false;

    const loadMovie = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchMovieById(id);
        if (!cancelled) {
          setMovie(data);
        }
      } catch (_err) {
        if (!cancelled) {
          setError(text.loadMovieError);
          setMovie(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMovie();

    return () => {
      cancelled = true;
    };
  }, [id, text.loadMovieError]);

  const genres = getMovieGenres(movie, language);

  const handleDelete = async () => {
    if (!window.confirm(text.confirmDelete)) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteMovie(id);
      navigate("/");
    } catch (_err) {
      setDeleteError(text.deleteMovieError);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="py-5 app-bg min-vh-100">
      <div className="container">
        <div className="d-flex justify-content-end mb-2">
          <LanguageSelector language={language} onChange={onLanguageChange} />
        </div>

        <Link className="btn btn-link ps-0 mb-3" to="/">
          ← {text.backToSearch}
        </Link>

        {loading && <p>{text.loadingMovie}</p>}

        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && deleteError && (
          <div className="alert alert-danger" role="alert">
            {deleteError}
          </div>
        )}

        {!loading && !error && movie && (
          <article className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-start mb-4">
                <div className="col-12 col-md-4 col-lg-3">
                  <img
                    src={getPosterUrl(movie)}
                    alt={getPosterAlt(movie, language)}
                    className="img-fluid rounded shadow-sm detail-poster"
                  />
                </div>
                <div className="col-12 col-md-8 col-lg-9">
                  <h1 className="mb-2">{getMovieTitle(movie, language)}</h1>
                  <p className="text-secondary mb-0">
                    {text.directedBy} {getMovieDirector(movie, language)}
                  </p>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <div className="detail-box">
                    <span>{text.year}</span>
                    <strong>{movie.año}</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="detail-box">
                    <span>{text.rating}</span>
                    <strong>{movie.puntuacion}/10</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="detail-box">
                    <span>{text.duration}</span>
                    <strong>{movie.duracion} min</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="detail-box">
                    <span>{text.genresCount}</span>
                    <strong>{genres.length}</strong>
                  </div>
                </div>
              </div>

              <section className="mb-4">
                <h2 className="h5">{text.genres}</h2>
                <div className="d-flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span key={genre} className="badge rounded-pill text-bg-primary">
                      {genre}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="h5">{text.synopsis}</h2>
                <p className="text-secondary mb-4 detail-synopsis">{getSynopsis(movie, language)}</p>
              </section>

              <section>
                <h2 className="h5">{text.mainActors}</h2>
                <ul className="list-group list-group-flush">
                  {movie.actores.map((actor) => (
                    <li key={actor} className="list-group-item px-0">
                      {actor}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? text.deletingMovie : text.deleteMovie}
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}

export default MovieDetailPage;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector.jsx";
import MovieCard from "../components/MovieCard.jsx";
import { fetchMovies } from "../lib/api.js";
import { getText } from "../lib/i18n.js";

const useDebouncedValue = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

function SearchPage({ language, onLanguageChange }) {
  const text = getText(language);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadMovies = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchMovies(debouncedQuery);
        if (!cancelled) {
          setMovies(data);
        }
      } catch (_err) {
        if (!cancelled) {
          setError(text.loadError);
          setMovies([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, text.loadError]);

  const resultText = useMemo(() => {
    if (loading) {
      return text.searching;
    }

    if (query.trim()) {
      return text.resultsFor(movies.length, query.trim());
    }

    return text.loadedMovies(movies.length);
  }, [loading, movies.length, query, text]);

  return (
    <main className="py-5 app-bg min-vh-100">
      <div className="container">
        <div className="d-flex justify-content-end mb-3">
          <LanguageSelector language={language} onChange={onLanguageChange} />
        </div>

        <header className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
          <div>
            <h1 className="display-6 fw-semibold mb-2">{text.appTitle}</h1>
            <p className="text-secondary mb-0">{text.appSubtitle}</p>
          </div>
          <Link
            className="btn btn-primary"
            to={language === "en" ? "/add" : "/agregar"}
          >
            {text.addMovie}
          </Link>
        </header>

        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <label htmlFor="movie-search" className="form-label fw-semibold">
              {text.searchLabel}
            </label>
            <input
              id="movie-search"
              type="search"
              className="form-control form-control-lg"
              placeholder={text.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <p className="small text-muted mt-3 mb-0">{resultText}</p>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="alert alert-warning" role="status">
            {text.emptyResults}
          </div>
        )}

        <section className="row g-3">
          {movies.map((movie) => (
            <div key={movie.id} className="col-12 col-md-6 col-lg-4">
              <MovieCard movie={movie} language={language} text={text} />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

export default SearchPage;

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { createMovie } from "../lib/api.js";
import { getText } from "../lib/i18n.js";

const INITIAL_FORM = {
  titulo: "",
  title: "",
  director: "",
  director_en: "",
  año: "",
  puntuacion: "",
  duracion: "",
  generos: "",
  genres: "",
  actores: "",
  sinopsis: "",
  synopsis: "",
  poster: "",
};

function AddMoviePage({ language, onLanguageChange }) {
  const text = getText(language);
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [posterMode, setPosterMode] = useState("url");
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addPath = language === "en" ? "/add" : "/agregar";

  useEffect(() => {
    if (location.pathname !== addPath) {
      navigate(addPath, { replace: true });
    }
  }, [addPath, location.pathname, navigate]);

  useEffect(() => {
    if (posterMode !== "upload" || !posterFile) {
      if (posterMode === "url") {
        setPosterPreview(form.poster.trim());
      } else {
        setPosterPreview("");
      }
      return undefined;
    }

    const objectUrl = URL.createObjectURL(posterFile);
    setPosterPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [form.poster, posterFile, posterMode]);

  const previewSrc = useMemo(() => {
    if (posterMode === "url") {
      return form.poster.trim();
    }

    return posterPreview;
  }, [form.poster, posterMode, posterPreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handlePosterModeChange = (mode) => {
    setPosterMode(mode);
    setPosterFile(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "poster" && posterMode === "upload") {
          return;
        }

        formData.append(key, value);
      });

      if (posterMode === "upload") {
        if (!posterFile) {
          throw new Error(text.posterRequired);
        }

        formData.append("posterFile", posterFile);
      }

      const created = await createMovie(formData);
      setSuccess(text.saveMovieSuccess);
      setForm(INITIAL_FORM);
      setPosterFile(null);
      setPosterMode("url");

      const detailPath = language === "en" ? `/movie/${created.id}` : `/pelicula/${created.id}`;
      navigate(detailPath);
    } catch (submitError) {
      setError(submitError.message || text.saveMovieError);
    } finally {
      setSubmitting(false);
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

        <header className="mb-4">
          <h1 className="display-6 fw-semibold mb-2">{text.addMovieTitle}</h1>
          <p className="text-secondary mb-0">{text.addMovieSubtitle}</p>
        </header>

        <section className="card border-0 shadow-sm">
          <div className="card-body p-4 p-md-5">
            <p className="text-muted small">{text.requiredFields}</p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="status">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="row g-4">
              <div className="col-12 col-md-6">
                <label htmlFor="titulo" className="form-label">
                  {text.titleEs} *
                </label>
                <input
                  id="titulo"
                  name="titulo"
                  type="text"
                  className="form-control"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="title" className="form-label">
                  {text.titleEn}
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="director" className="form-label">
                  {text.director} *
                </label>
                <input
                  id="director"
                  name="director"
                  type="text"
                  className="form-control"
                  value={form.director}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="director_en" className="form-label">
                  {text.directorEn}
                </label>
                <input
                  id="director_en"
                  name="director_en"
                  type="text"
                  className="form-control"
                  value={form.director_en}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="año" className="form-label">
                  {text.yearField} *
                </label>
                <input
                  id="año"
                  name="año"
                  type="number"
                  min="1888"
                  max="2100"
                  className="form-control"
                  value={form.año}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="puntuacion" className="form-label">
                  {text.ratingField} *
                </label>
                <input
                  id="puntuacion"
                  name="puntuacion"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  className="form-control"
                  value={form.puntuacion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="duracion" className="form-label">
                  {text.durationField} *
                </label>
                <input
                  id="duracion"
                  name="duracion"
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.duracion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="generos" className="form-label">
                  {text.genresEs} *
                </label>
                <input
                  id="generos"
                  name="generos"
                  type="text"
                  className="form-control"
                  placeholder="Drama, Acción"
                  value={form.generos}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="genres" className="form-label">
                  {text.genresEn}
                </label>
                <input
                  id="genres"
                  name="genres"
                  type="text"
                  className="form-control"
                  placeholder="Drama, Action"
                  value={form.genres}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label htmlFor="actores" className="form-label">
                  {text.actors} *
                </label>
                <input
                  id="actores"
                  name="actores"
                  type="text"
                  className="form-control"
                  value={form.actores}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="sinopsis" className="form-label">
                  {text.synopsisEs} *
                </label>
                <textarea
                  id="sinopsis"
                  name="sinopsis"
                  className="form-control"
                  rows={4}
                  value={form.sinopsis}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="synopsis" className="form-label">
                  {text.synopsisEn}
                </label>
                <textarea
                  id="synopsis"
                  name="synopsis"
                  className="form-control"
                  rows={4}
                  value={form.synopsis}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <h2 className="h5 mb-3">{text.posterSection}</h2>

                <div className="btn-group mb-3" role="group" aria-label={text.posterSection}>
                  <button
                    type="button"
                    className={`btn ${posterMode === "url" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handlePosterModeChange("url")}
                  >
                    {text.posterUrlMode}
                  </button>
                  <button
                    type="button"
                    className={`btn ${posterMode === "upload" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handlePosterModeChange("upload")}
                  >
                    {text.posterUploadMode}
                  </button>
                </div>

                {posterMode === "url" ? (
                  <div>
                    <label htmlFor="poster" className="form-label">
                      {text.posterUrl} *
                    </label>
                    <input
                      id="poster"
                      name="poster"
                      type="url"
                      className="form-control"
                      placeholder={text.posterUrlPlaceholder}
                      value={form.poster}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="posterFile" className="form-label">
                      {text.posterFileLabel} *
                    </label>
                    <input
                      id="posterFile"
                      name="posterFile"
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(event) => setPosterFile(event.target.files?.[0] || null)}
                      required
                    />
                  </div>
                )}

                {previewSrc && (
                  <div className="mt-3">
                    <p className="small text-muted mb-2">{text.posterPreview}</p>
                    <img
                      src={previewSrc}
                      alt={text.posterPreview}
                      className="img-fluid rounded shadow-sm detail-poster"
                      style={{ maxWidth: "220px" }}
                    />
                  </div>
                )}
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? text.savingMovie : text.saveMovie}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AddMoviePage;

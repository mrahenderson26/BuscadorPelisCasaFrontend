import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { createProducto, createProductoWithFile } from "../lib/api.js";
import { getText } from "../lib/i18n.js";

const INITIAL_FORM = {
  nombre: "",
  precio: "",
  imagen: "",
};

function AgregarProducto({ language, onLanguageChange }) {
  const text = getText(language);
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [imagenMode, setImagenMode] = useState("url");
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (imagenMode !== "upload" || !imagenFile) {
      setImagenPreview(imagenMode === "url" ? form.imagen.trim() : "");
      return;
    }

    const objectUrl = URL.createObjectURL(imagenFile);
    setImagenPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [form.imagen, imagenFile, imagenMode]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImagenModeChange = (mode) => {
    setImagenMode(mode);
    setImagenFile(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      let created;

      if (imagenMode === "upload") {
        if (!imagenFile) {
          throw new Error(text.imageRequired);
        }
        const formData = new FormData();
        formData.append("nombre", form.nombre);
        formData.append("precio", form.precio);
        formData.append("imagenFile", imagenFile);
        created = await createProductoWithFile(formData);
      } else {
        created = await createProducto({
          nombre: form.nombre,
          precio: form.precio,
          imagen: form.imagen,
        });
      }

      setSuccess(text.saveProductSuccess);
      setForm(INITIAL_FORM);
      setImagenFile(null);
      setImagenMode("url");
      navigate(`/producto/${created.id}`);
    } catch (submitError) {
      setError(submitError.message || text.saveProductError);
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
          ← {text.backToCatalog}
        </Link>

        <header className="mb-4">
          <h1 className="display-6 fw-semibold mb-2">{text.addProductTitle}</h1>
          <p className="text-secondary mb-0">{text.addProductSubtitle}</p>
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
                <label htmlFor="nombre" className="form-label">
                  {text.name} *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  className="form-control"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="precio" className="form-label">
                  {text.priceField} *
                </label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  value={form.precio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <h2 className="h5 mb-3">{text.imageSection}</h2>

                <div className="btn-group mb-3" role="group" aria-label={text.imageSection}>
                  <button
                    type="button"
                    className={`btn ${imagenMode === "url" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handleImagenModeChange("url")}
                  >
                    {text.imageUrlMode}
                  </button>
                  <button
                    type="button"
                    className={`btn ${imagenMode === "upload" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handleImagenModeChange("upload")}
                  >
                    {text.imageUploadMode}
                  </button>
                </div>

                {imagenMode === "url" ? (
                  <div>
                    <label htmlFor="imagen" className="form-label">
                      {text.imageUrl}
                    </label>
                    <input
                      id="imagen"
                      name="imagen"
                      type="url"
                      className="form-control"
                      placeholder={text.imageUrlPlaceholder}
                      value={form.imagen}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="imagenFile" className="form-label">
                      {text.imageFileLabel}
                    </label>
                    <input
                      id="imagenFile"
                      name="imagenFile"
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(event) => setImagenFile(event.target.files?.[0] || null)}
                    />
                  </div>
                )}

                {imagenPreview && (
                  <div className="mt-3">
                    <p className="small text-muted mb-2">{text.imagePreview}</p>
                    <img
                      src={imagenPreview}
                      alt={text.imagePreview}
                      className="img-fluid rounded shadow-sm detail-image"
                      style={{ maxWidth: "220px" }}
                    />
                  </div>
                )}
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? text.savingProduct : text.saveProduct}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AgregarProducto;

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { deleteProducto, fetchProductoById } from "../lib/api.js";
import { formatPrecio, getImagenAlt, getImagenUrl, getNombre, getPrecio } from "../lib/productMedia.js";
import { getText } from "../lib/i18n.js";

function ProductoDetalle({ language, onLanguageChange }) {
  const text = getText(language);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchProductoById(id);
        if (!cancelled) {
          setProduct(data);
        }
      } catch {
        if (!cancelled) {
          setError(text.loadProductError);
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id, text.loadProductError]);

  const handleDelete = async () => {
    if (!window.confirm(text.confirmDelete)) {
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteProducto(id);
      navigate("/");
    } catch {
      setDeleteError(text.deleteProductError);
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
          ← {text.backToCatalog}
        </Link>

        {loading && <p>{text.loadingProduct}</p>}

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

        {!loading && !error && product && (
          <article className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-start mb-4">
                <div className="col-12 col-md-4 col-lg-3">
                  <img
                    src={getImagenUrl(product)}
                    alt={getImagenAlt(product)}
                    className="img-fluid rounded shadow-sm detail-image"
                  />
                </div>
                <div className="col-12 col-md-8 col-lg-9">
                  <h1 className="mb-2">{getNombre(product)}</h1>
                  <p className="fs-3 fw-semibold text-primary mb-0">
                    {formatPrecio(getPrecio(product))}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? text.deletingProduct : text.deleteProduct}
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}

export default ProductoDetalle;

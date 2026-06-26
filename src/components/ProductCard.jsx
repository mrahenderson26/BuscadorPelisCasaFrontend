import { Link } from "react-router-dom";
import { formatPrecio, getImagenAlt, getImagenUrl, getNombre, getPrecio } from "../lib/productMedia.js";

function ProductCard({ product, text }) {
  const detallePath = `/producto/${product.id}`;

  return (
    <article className="card shadow-sm h-100 product-card">
      <img
        src={getImagenUrl(product)}
        className="card-img-top product-image"
        alt={getImagenAlt(product)}
        loading="lazy"
      />
      <div className="card-body d-flex flex-column">
        <h2 className="h5 card-title mb-2">{getNombre(product)}</h2>
        <p className="mb-3 fs-5 fw-semibold text-primary">{formatPrecio(getPrecio(product))}</p>
        <div className="mt-auto">
          <Link className="btn btn-outline-primary btn-sm" to={detallePath}>
            {text.viewDetail}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

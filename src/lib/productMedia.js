const IMAGEN_FALLBACK = "https://placehold.co/400x600/e9ecef/495057?text=Sin+imagen";

export const getImagenUrl = (product) => {
  const imagen = product?.imagen;
  if (typeof imagen === "string" && imagen.trim()) {
    return imagen.trim();
  }
  return IMAGEN_FALLBACK;
};

export const getImagenAlt = (product) => {
  const nombre = product?.nombre;
  if (typeof nombre === "string" && nombre.trim()) {
    return `Imagen de ${nombre.trim()}`;
  }
  return "Producto sin nombre";
};

export const getNombre = (product) => {
  if (typeof product?.nombre === "string" && product.nombre.trim()) {
    return product.nombre.trim();
  }
  return "Producto sin nombre";
};

export const getPrecio = (product) => {
  const precio = Number(product?.precio);
  if (Number.isFinite(precio)) {
    return precio;
  }
  return 0;
};

export const formatPrecio = (precio) => {
  return `${Number(precio).toFixed(2)} €`;
};

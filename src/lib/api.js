const PRODUCTION_API_URL = "https://buscadorpeliscasabackend.onrender.com";
const LOCAL_API_URL = "http://localhost:3000";

const fallbackApiUrl = import.meta.env.DEV ? LOCAL_API_URL : PRODUCTION_API_URL;
const API_BASE_URL = (import.meta.env.VITE_API_URL || fallbackApiUrl).replace(/\/+$/, "");

const buildUrl = (path, params = {}) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

const readJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "No se pudo obtener la información del servidor");
  }
  return response.json();
};

export const fetchProductos = (query) => readJson(buildUrl("/api/productos", { q: query }));

export const fetchProductoById = (id) => readJson(buildUrl(`/api/productos/${id}`));

export const createProducto = (data) =>
  readJson(buildUrl("/api/productos"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const createProductoWithFile = (formData) =>
  readJson(buildUrl("/api/productos"), {
    method: "POST",
    body: formData,
  });

export const deleteProducto = (id) =>
  readJson(buildUrl(`/api/productos/${id}`), {
    method: "DELETE",
  });

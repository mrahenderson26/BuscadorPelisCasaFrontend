const PRODUCTION_API_URL = "https://buscadorpeliscasabackend.onrender.com";
const LOCAL_API_URL = "http://localhost:3001";

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

export const fetchMovies = (query) => readJson(buildUrl("/api/movies", { q: query }));

export const fetchMovieById = (id) => readJson(buildUrl(`/api/movies/${id}`));

export const createMovie = (formData) =>
  readJson(buildUrl("/api/movies"), {
    method: "POST",
    body: formData,
  });

export const deleteMovie = (id) =>
  readJson(buildUrl(`/api/movies/${id}`), {
    method: "DELETE",
  });

import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SearchPage from "./pages/SearchPage.jsx";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";
import AddMoviePage from "./pages/AddMoviePage.jsx";

function App() {
  const initialLanguage = useMemo(() => {
    if (typeof window === "undefined") {
      return "es";
    }

    const stored = window.localStorage.getItem("app_language");
    if (stored === "es" || stored === "en") {
      return stored;
    }

    return "es";
  }, []);

  const [language, setLanguage] = useState(initialLanguage);

  const handleLanguageChange = (nextLanguage) => {
    const validLanguage = nextLanguage === "en" ? "en" : "es";
    setLanguage(validLanguage);
    window.localStorage.setItem("app_language", validLanguage);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<SearchPage language={language} onLanguageChange={handleLanguageChange} />}
      />
      <Route
        path="/pelicula/:id"
        element={<MovieDetailPage language={language} onLanguageChange={handleLanguageChange} />}
      />
      <Route
        path="/movie/:id"
        element={<MovieDetailPage language={language} onLanguageChange={handleLanguageChange} />}
      />
      <Route
        path="/agregar"
        element={<AddMoviePage language={language} onLanguageChange={handleLanguageChange} />}
      />
      <Route
        path="/add"
        element={<AddMoviePage language={language} onLanguageChange={handleLanguageChange} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

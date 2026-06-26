import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ListaProductos from "./pages/ListaProductos.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import AgregarProducto from "./pages/AgregarProducto.jsx";

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
        element={<ListaProductos language={language} onLanguageChange={handleLanguageChange} />}
      />
      <Route
        path="/producto/:id"
        element={<ProductoDetalle language={language} onLanguageChange={handleLanguageChange} />}
      />
      <Route
        path="/agregar"
        element={<AgregarProducto language={language} onLanguageChange={handleLanguageChange} />}
      />
      <Route
        path="/add"
        element={<AgregarProducto language={language} onLanguageChange={handleLanguageChange} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

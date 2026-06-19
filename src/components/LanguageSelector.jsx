function LanguageSelector({ language, onChange }) {
  const label = language === "en" ? "Language" : "Idioma";

  return (
    <div className="language-selector d-inline-flex align-items-center gap-2">
      <label htmlFor="language-select" className="small text-muted mb-0">
        {label}
      </label>
      <select
        id="language-select"
        className="form-select form-select-sm"
        value={language}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

export default LanguageSelector;

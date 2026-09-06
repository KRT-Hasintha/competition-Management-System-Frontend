import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// TypeScript does not have declarations for CSS side-effect imports in this setup.
// @ts-expect-error CSS is handled by the bundler at runtime.
import "./index.css";
import "./i18n";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
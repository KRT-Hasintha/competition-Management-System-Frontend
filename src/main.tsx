// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";

// // TypeScript does not resolve CSS side-effect imports without a stylesheet declaration.
// // @ts-expect-error CSS is handled by the bundler.
// import "./index.css";
// import "./i18n";

// ReactDOM.createRoot(
//   document.getElementById("root")!
// ).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// @ts-ignore
import "./index.css";
import "./i18n";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
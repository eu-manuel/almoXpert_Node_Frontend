import React from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/LoginPage"; // caminho correto
import "./index.css"; // CSS global

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoginPage />
  </React.StrictMode>
);

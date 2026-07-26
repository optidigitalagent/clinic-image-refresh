import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StaticApp } from "./StaticApp";
import "../src/styles.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element was not found");
}

createRoot(container).render(
  <StrictMode>
    <StaticApp />
  </StrictMode>,
);

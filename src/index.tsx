import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { DrawerProvider } from "./context/DrawerContext";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("App container not found.");
}

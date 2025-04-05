// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    // removed <StrictMode> wrapper for now to avoid double rendering in dev
    <App height={400} width={800} />

);

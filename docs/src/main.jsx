import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "./routes.jsx";
import "./styles/docs.css";

const container = document.getElementById("root");
if (!container) throw new Error("#root element not found");

// The site may be served from a sub-path (e.g. /<repo>/ on GitHub Pages).
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
const router = createBrowserRouter(routes, { basename });

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

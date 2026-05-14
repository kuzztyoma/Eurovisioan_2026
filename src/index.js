import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

function loadTailwind() {
  return new Promise((resolve) => {
    if (document.getElementById("tailwind-cdn")) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = "tailwind-cdn";
    script.src = "https://cdn.tailwindcss.com";

    script.onload = () => resolve();

    script.onerror = () => {
      console.warn("Tailwind CDN failed to load. App will render anyway.");
      resolve();
    };

    document.head.appendChild(script);
  });
}

function renderApp() {
  const rootElement = document.getElementById("root");
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

loadTailwind().then(renderApp);

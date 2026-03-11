import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const PRELOAD_RETRY_KEY = "vite-preload-retried";

async function clearClientCaches() {
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }
  } catch (error) {
    console.error("[boot] failed to clear client caches", error);
  }
}

window.addEventListener("vite:preloadError", async (event) => {
  event.preventDefault();

  const alreadyRetried = sessionStorage.getItem(PRELOAD_RETRY_KEY) === "1";
  if (alreadyRetried) {
    console.error("[boot] preload error persisted after retry", event);
    return;
  }

  sessionStorage.setItem(PRELOAD_RETRY_KEY, "1");
  await clearClientCaches();
  window.location.reload();
});

window.addEventListener("error", (event) => {
  console.error("[global-error]", event.error ?? event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("[unhandled-rejection]", event.reason);
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


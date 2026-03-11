import React from "react";
import { createRoot, Root } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const PRELOAD_RETRY_KEY = "vite-preload-retried";
const BOOT_LOG_PREFIX = "[boot-debug][main]";

function BootFatalFallback({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold text-destructive">Falha no boot do app</h1>
        <p className="text-sm text-destructive/90">{message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Recarregar app
        </button>
      </div>
    </div>
  );
}

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
    console.error(`${BOOT_LOG_PREFIX} failed to clear client caches`, error);
  }
}

console.info(`${BOOT_LOG_PREFIX} entrada do app`);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemento #root não encontrado.");
}

const root: Root = createRoot(rootElement);

const renderFatalBootFallback = (reason: unknown) => {
  const message = reason instanceof Error
    ? reason.message
    : typeof reason === "string"
      ? reason
      : "Erro inesperado durante a inicialização.";

  console.error(`${BOOT_LOG_PREFIX} fallback fatal acionado`, reason);
  root.render(<BootFatalFallback message={message} />);
};

window.addEventListener("vite:preloadError", async (event) => {
  event.preventDefault();

  const alreadyRetried = sessionStorage.getItem(PRELOAD_RETRY_KEY) === "1";
  if (alreadyRetried) {
    console.error(`${BOOT_LOG_PREFIX} preload error persisted after retry`, event);
    renderFatalBootFallback("Não foi possível carregar os arquivos mais recentes. Recarregue para sincronizar.");
    return;
  }

  console.warn(`${BOOT_LOG_PREFIX} preload error detectado, tentando autocorreção`);
  sessionStorage.setItem(PRELOAD_RETRY_KEY, "1");
  await clearClientCaches();
  window.location.reload();
});

window.addEventListener("error", (event) => {
  console.error(`${BOOT_LOG_PREFIX} [global-error]`, event.error ?? event.message);
  renderFatalBootFallback(event.error ?? event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error(`${BOOT_LOG_PREFIX} [unhandled-rejection]`, event.reason);
  renderFatalBootFallback(event.reason);
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


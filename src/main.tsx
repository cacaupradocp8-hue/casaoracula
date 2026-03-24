import React from "react";
import { createRoot, Root } from "react-dom/client";
import "./index.css";

const PRELOAD_RETRY_KEY = "vite-preload-retried";
const BOOT_IMPORT_RETRY_KEY = "vite-boot-import-retried";
const BOOT_STALL_RETRY_KEY = "vite-boot-stall-retried";
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

function hardenReactRootAgainstExternalDomMutation(rootNode: HTMLElement) {
  try {
    document.documentElement.setAttribute("translate", "no");
    document.documentElement.classList.add("notranslate");
    document.body?.setAttribute("translate", "no");
    document.body?.classList.add("notranslate");
    rootNode.setAttribute("translate", "no");
    rootNode.classList.add("notranslate");

    const hasGoogleNoTranslate = document.head.querySelector('meta[name="google"][content="notranslate"]');
    if (!hasGoogleNoTranslate) {
      const meta = document.createElement("meta");
      meta.name = "google";
      meta.content = "notranslate";
      document.head.appendChild(meta);
    }
  } catch (error) {
    console.warn(`${BOOT_LOG_PREFIX} falha ao endurecer a raiz contra mutações externas`, error);
  }
}

console.info(`${BOOT_LOG_PREFIX} entrada do app`);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemento #root não encontrado.");
}

hardenReactRootAgainstExternalDomMutation(rootElement);

// Patch DOM globally to prevent "removeChild" crashes from browser extensions or HMR
const origRemoveChild = Node.prototype.removeChild;
Node.prototype.removeChild = function <T extends Node>(child: T): T {
  if (child.parentNode !== this) {
    console.warn(`${BOOT_LOG_PREFIX} removeChild interceptado — nó órfão ignorado`);
    return child;
  }
  return origRemoveChild.call(this, child) as T;
};

const origInsertBefore = Node.prototype.insertBefore;
Node.prototype.insertBefore = function <T extends Node>(newNode: T, refNode: Node | null): T {
  if (refNode && refNode.parentNode !== this) {
    console.warn(`${BOOT_LOG_PREFIX} insertBefore interceptado — ref órfão ignorado`);
    return newNode;
  }
  return origInsertBefore.call(this, newNode, refNode) as T;
};

const root: Root = createRoot(rootElement);
let bootWindowOpen = true;
window.setTimeout(() => {
  bootWindowOpen = false;
}, 10000);

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
  if (!bootWindowOpen) return;
  if (event.error instanceof Error && event.error.stack?.includes("createElement")) {
    renderFatalBootFallback(event.error);
  }
});

window.addEventListener("unhandledrejection", (event) => {
  console.error(`${BOOT_LOG_PREFIX} [unhandled-rejection]`, event.reason);
});

window.setTimeout(async () => {
  const rootStillEmpty = rootElement.innerHTML.trim().length === 0;
  if (!rootStillEmpty) return;

  const alreadyRetried = sessionStorage.getItem(BOOT_STALL_RETRY_KEY) === "1";
  if (alreadyRetried) {
    renderFatalBootFallback("A aplicação não conseguiu renderizar a interface inicial.");
    return;
  }

  console.warn(`${BOOT_LOG_PREFIX} boot stall detectado, limpando cache e recarregando`);
  sessionStorage.setItem(BOOT_STALL_RETRY_KEY, "1");
  await clearClientCaches();
  window.location.reload();
}, 12000);

async function bootstrapApp() {
  try {
    const { default: App } = await import("./App.tsx");
    root.render(<App />);
  } catch (error) {
    const alreadyRetried = sessionStorage.getItem(BOOT_IMPORT_RETRY_KEY) === "1";

    if (!alreadyRetried) {
      console.warn(`${BOOT_LOG_PREFIX} falha ao carregar App.tsx, tentando autocorreção`, error);
      sessionStorage.setItem(BOOT_IMPORT_RETRY_KEY, "1");
      await clearClientCaches();
      window.location.reload();
      return;
    }

    renderFatalBootFallback(error);
  }
}

void bootstrapApp();


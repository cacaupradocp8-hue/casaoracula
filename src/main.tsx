import React from "react"; // REBUILD_V100
import { createRoot, Root } from "react-dom/client";
import "./index.css";

const BOOT_LOG_PREFIX = "[DEBUG_UI][main]";
const APP_MOUNT_EVENT = "lovable:app-mounted";

function BootFatalFallback({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold text-red-500">Falha no boot do app</h1>
        <p className="text-sm text-red-500/90">{message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md bg-white text-black px-4 py-2 text-sm font-medium"
        >
          Recarregar app
        </button>
      </div>
    </div>
  );
}

console.info(`${BOOT_LOG_PREFIX} entrada do app`, { url: window.location.href, ts: Date.now() });

const rootElement = document.getElementById("root");
if (!rootElement) {
  document.body.innerHTML = '<div style="color:red;padding:20px">ERRO CRÍTICO: #root não encontrado</div>';
  throw new Error("Elemento #root não encontrado.");
}

const root: Root = createRoot(rootElement);

window.addEventListener(APP_MOUNT_EVENT, () => {
  console.info(`${BOOT_LOG_PREFIX} app montado com sucesso`);
});

async function bootstrapApp() {
  try {
    console.info(`${BOOT_LOG_PREFIX} bootstrapApp iniciando`);
    const { default: App } = await import("./App.tsx");
    console.info(`${BOOT_LOG_PREFIX} App.tsx importado, renderizando...`);
    root.render(<App />);
  } catch (error) {
    console.error(`${BOOT_LOG_PREFIX} Falha fatal no bootstrap`, error);
    root.render(<BootFatalFallback message={String(error)} />);
  }
}

void bootstrapApp();

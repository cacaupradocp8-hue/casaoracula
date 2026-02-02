import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "@/components/ui/sonner";

/**
 * Mostra um toast quando houver uma nova versão do app (PWA) disponível.
 * Isso evita ficar presa em versões antigas por cache de Service Worker.
 */
export function ServiceWorkerUpdateToast() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
  });

  useEffect(() => {
    if (!needRefresh) return;

    toast("Nova versão disponível", {
      description: "Toque em Atualizar para carregar a versão mais recente.",
      duration: Infinity,
      action: {
        label: "Atualizar",
        onClick: () => updateServiceWorker(true),
      },
    });
  }, [needRefresh, updateServiceWorker]);

  return null;
}

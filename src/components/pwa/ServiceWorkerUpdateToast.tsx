import { useEffect, useCallback } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "@/components/ui/sonner";

/**
 * Gerencia atualizações do Service Worker (PWA).
 * - Verifica atualizações a cada 30 segundos
 * - Aplica atualizações automaticamente quando disponíveis
 * - Mostra toast apenas se auto-update falhar
 */
export function ServiceWorkerUpdateToast() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      // Check for updates every 30 seconds (more aggressive)
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 30 * 1000);
      }
    },
  });

  const doUpdate = useCallback(() => {
    updateServiceWorker(true);
  }, [updateServiceWorker]);

  useEffect(() => {
    if (!needRefresh) return;

    // Try to auto-update first
    doUpdate();

    // Show toast as fallback in case auto-update doesn't trigger reload
    const timeout = setTimeout(() => {
      toast("Nova versão disponível", {
        description: "Toque para atualizar agora.",
        duration: Infinity,
        action: {
          label: "Atualizar",
          onClick: doUpdate,
        },
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [needRefresh, doUpdate]);

  return null;
}

/**
 * Força limpeza completa de cache e recarregamento.
 * Use como último recurso quando o app não atualiza.
 */
export async function forceFullRefresh() {
  try {
    // Unregister all service workers
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    }

    // Clear all caches
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }

    // Hard reload
    window.location.reload();
  } catch (e) {
    // Fallback: just reload
    window.location.reload();
  }
}

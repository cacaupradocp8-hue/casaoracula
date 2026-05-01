import { useEffect, useCallback, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "@/components/ui/sonner";

/**
 * Gerencia atualizações do Service Worker (PWA).
 * Não força recarregamento automático: durante deploys/atualizações isso pode
 * interromper a navegação e deixar a usuária presa em uma tela branca.
 */
export function ServiceWorkerUpdateToast() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 10 * 60 * 1000);
      }
    },
  });


  const doUpdate = useCallback(() => {
    updateServiceWorker(true);
  }, [updateServiceWorker]);

  useEffect(() => {
    if (!mounted || !needRefresh) return;

    toast("Nova versão disponível", {
      description: "Atualize quando terminar o que está fazendo.",
      duration: Infinity,
      action: {
        label: "Atualizar",
        onClick: doUpdate,
      },
    });
  }, [needRefresh, doUpdate]);

  if (!mounted) return null;
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

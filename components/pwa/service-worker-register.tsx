"use client";

import { useEffect } from "react";

/**
 * ServiceWorkerRegister
 * Registers the PWA service worker in production environments.
 * Listens for updates and provides background caching for field operations.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            if (process.env.NODE_ENV === "development") {
              console.log("[PWA] Service Worker registered with scope:", registration.scope);
            }
          })
          .catch((error) => {
            console.error("[PWA] Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}

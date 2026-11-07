"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";

/**
 * Native-only navigation adapter. Desktop navigation is not modified.
 * Back button first gives FILMOOD a chance to dismiss a dialog or restore
 * its own client-side history. External film links open in a native browser.
 */
export default function NativeBridge() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let disposed = false;
    let removeBack: (() => Promise<void>) | undefined;

    void App.addListener("backButton", () => {
      const backEvent = new Event("filmood:native-back", { cancelable: true });
      window.dispatchEvent(backEvent);
      if (backEvent.defaultPrevented) return;

      const path = window.location.pathname.replace(/\/$/, "") || "/";
      if (path !== "/" && path !== "/studio") {
        if (window.history.length > 1) window.history.back();
        else window.location.assign("/");
      } else {
        void App.minimizeApp();
      }
    }).then(handle => {
      if (disposed) void handle.remove();
      else removeBack = () => handle.remove();
    });

    const openLinks = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      let url: URL;
      try { url = new URL(href, window.location.href); }
      catch { return; }
      if (url.protocol !== "https:" && url.protocol !== "http:") return;

      if (url.origin !== window.location.origin) {
        event.preventDefault();
        void Browser.open({ url: url.toString() });
      } else if (anchor.target === "_blank") {
        // The app has a single navigation stack; don't spawn an unmanaged WebView.
        event.preventDefault();
        window.location.assign(url.pathname + url.search + url.hash);
      }
    };
    document.addEventListener("click", openLinks, true);
    return () => {
      disposed = true;
      if (removeBack) void removeBack();
      document.removeEventListener("click", openLinks, true);
    };
  }, []);

  return null;
}

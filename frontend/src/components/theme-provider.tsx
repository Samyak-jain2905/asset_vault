"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      const el = document.createElement('div');
      el.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;background:red;color:white;padding:20px;font-family:monospace;max-width:100%;word-wrap:break-word;';
      el.innerHTML = 'JS Error: ' + e.message + '<br>' + (e.error ? e.error.stack : '');
      document.body.appendChild(el);
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      const el = document.createElement('div');
      el.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;background:orange;color:white;padding:20px;font-family:monospace;max-width:100%;word-wrap:break-word;';
      el.innerHTML = 'Promise Error: ' + e.reason;
      document.body.appendChild(el);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

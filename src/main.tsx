import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "@/i18n";
import "@/store/localeStore";
import "@/store/themeStore";
import App from "./App.tsx";
import { I18nSync } from "@/components/shared/I18nSync";
import { OneSignalBootstrap } from "@/components/shared/OneSignalBootstrap";
import { initOneSignal } from "@/lib/onesignal";

void initOneSignal();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nSync />
      <OneSignalBootstrap />
      <App />
      <Toaster position="top-right" />
    </BrowserRouter>
  </StrictMode>
);

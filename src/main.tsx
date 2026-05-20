import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";
import { OneSignalBootstrap } from "@/components/shared/OneSignalBootstrap";
import { initOneSignal } from "@/lib/onesignal";

void initOneSignal();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <OneSignalBootstrap />
      <App />
      <Toaster position="top-right" />
    </BrowserRouter>
  </StrictMode>
);

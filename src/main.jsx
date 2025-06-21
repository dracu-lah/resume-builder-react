import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/shared/ModeToggle/theme-provider";
import { Toaster } from "@/components/ui/sonner";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <App />
      <Toaster richColors />
    </ThemeProvider>
  </StrictMode>,
);

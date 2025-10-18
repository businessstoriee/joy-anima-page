import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from "@/components/language/useLanguageTranslation.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeProvider defaultTheme="light" storageKey="greeting-theme">
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

// import { StrictMode } from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  // removed <StrictMode> wrapper for now to avoid double rendering in dev
  <ChakraProvider value={defaultSystem}>
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <App />
    </ThemeProvider>
  </ChakraProvider>
);

import "./init";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App.tsx";
import AppProvider from "./context/AppProvider.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(
	<StrictMode>
		<ChakraProvider value={defaultSystem}>
			<ThemeProvider attribute="class" disableTransitionOnChange>
				<AppProvider>
					<App />
				</AppProvider>
			</ThemeProvider>
		</ChakraProvider>
	</StrictMode>,
);

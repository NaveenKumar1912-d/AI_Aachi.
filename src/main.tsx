import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Add error boundary to catch rendering errors
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Error Loading Application</h1>
      <p>There was an error loading the application. Please check the console for details.</p>
      <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
    </div>
  `;
}

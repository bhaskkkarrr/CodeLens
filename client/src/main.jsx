import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import { GithubProvider } from "./context/GitHubContext.jsx";
import { RAGProvider } from "./context/RAGContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <GithubProvider>
        <RAGProvider>
          <App />
        </RAGProvider>
      </GithubProvider>
    </AuthProvider>
  </BrowserRouter>,
);

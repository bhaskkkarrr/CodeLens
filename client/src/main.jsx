import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import { GithubProvider } from "./context/GitHubContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <GithubProvider>
        <App />
      </GithubProvider>
    </AuthProvider>
  </BrowserRouter>,
);

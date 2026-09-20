import { useContext } from "react";
import { createContext } from "react";
import { useAuth } from "./AuthContext";
import { useGithub } from "./GitHubContext";
import { axiosInstance } from "../services/axiosInstance";

const RAGContext = createContext();
export const RAGProvider = ({ children }) => {
  const { token } = useAuth();
  const { selectedRepository } = useGithub();
  const ask_question = async (query) => {
    const response = await axiosInstance.post(
      "/api/rag/ask-question",
      { query, repoId: selectedRepository },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("Answer: ", response.data);
  };
  return <RAGContext.Provider value={{}}>{children}</RAGContext.Provider>;
};

export const useRAG = () => {
  return useContext(RAGContext);
};

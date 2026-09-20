import { useContext, useState } from "react";
import { createContext } from "react";
import { useAuth } from "./AuthContext";
import { useGithub } from "./GitHubContext";
import { axiosInstance } from "../services/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const RAGContext = createContext();
export const RAGProvider = ({ children }) => {
  const { token } = useAuth();
  const { selectedRepository } = useGithub();
  const [allChats, setAllChats] = useState(null);
  const [isGettingAllChats, setIsGettingAllChats] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();
  const getAllChats = async () => {
    try {
      const res = await axiosInstance.get("/api/chat/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllChats(res.data.conversations);
    } catch (error) {
      if (!error?.response?.data?.message === "no conversations started yet") {
        toast.error(
          error?.response?.data?.message ||
            error?.response ||
            "Something went wrong",
        );
      }
    } finally {
      setIsGettingAllChats(false);
    }
  };

  const getConversation = async (id) => {
    try {
      const currentChat = await axiosInstance.get(`/api/chat/c/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (currentChat.data.success) {
        setSelectedChat(currentChat.data.conversation);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response ||
          "Something went wrong",
      );
      navigate("/dashboard");
    }
  };

  const ask_question = async (query) => {
    const response = await axiosInstance.post(
      "/api/rag/ask-question",
      { query, repoId: selectedRepository },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("Answer: ", response.data);
  };

  console.log("Chat", selectedChat);
  return (
    <RAGContext.Provider
      value={{
        getAllChats,
        allChats,
        isGettingAllChats,
        getConversation,
        selectedChat,
      }}
    >
      {children}
    </RAGContext.Provider>
  );
};

export const useRAG = () => {
  return useContext(RAGContext);
};

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
  const [selectedChatMessages, setSelectedChatMessages] = useState(null);
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
        setSelectedChatMessages(currentChat.data.conversation.messages);
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
    try {
      const response = await axiosInstance.post(
        "/api/rag/ask-question",
        {
          query,
          repoId: selectedChat.githubRepoId,
          chatCode: selectedChat.chatCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Answer:", response.data);

      if (!response.data.success) {
        toast.error(response.data.message || "Failed to generate AI response");
        return;
      }

      const newMessage = {
        question: query,
        answer: response.data.answer,
        sources: response.data.source || [],
        createdAt: new Date().toISOString(),
      };

      setSelectedChatMessages((prevMessages) => [
        ...(prevMessages || []),
        newMessage,
      ]);
    } catch (error) {
      console.error("Ask question error:", error);

      toast.error(error?.response?.data?.message || "Something went wrong");

      throw error;
    }
  };

  console.log("Chat", selectedChat);
  return (
    <RAGContext.Provider
      value={{
        getAllChats,
        allChats,
        setAllChats,
        isGettingAllChats,
        getConversation,
        selectedChat,
        ask_question,
        selectedChatMessages,
        setSelectedChatMessages,
      }}
    >
      {children}
    </RAGContext.Provider>
  );
};

export const useRAG = () => {
  return useContext(RAGContext);
};

import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/axiosInstance";
import { useAuth } from "./AuthContext";

export const GithubContext = createContext();
export const GithubProvider = ({ children }) => {
  const { token } = useAuth();
  const [isGettingRepos, setIsGettingRepos] = useState(false);
  const [isImportingRepository, setIsImportingRepository] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState(null);
  const [repositories, setRepositories] = useState(null);
  const getAllRepositories = async () => {
    try {
      setIsGettingRepos(true);
      const res = await axiosInstance.get("/api/git/repositories");
      console.log(res.data);
      setRepositories(res.data.repositories);
    } catch (error) {
      console.error("Getting all repositories error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setIsGettingRepos(false);
    }
  };
  useEffect(() => {
    if (!token) {
      return;
    }

    getAllRepositories();
  }, [token]);

  const repositoryImport = async (id) => {
    console.log(id);
    try {
      setIsImportingRepository(true);

      const res = await axiosInstance.post("/api/git/clone", {
        repoId: id,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setSelectedRepository(res.data.repo);
      }
    } catch (error) {
      console.error("Repository import error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setIsImportingRepository(false);
    }
  };

  return (
    <GithubContext.Provider
      value={{
        getAllRepositories,
        repositoryImport,
        isGettingRepos,
        isImportingRepository,
        repositories,
        selectedRepository,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export const useGithub = () => {
  return useContext(GithubContext);
};

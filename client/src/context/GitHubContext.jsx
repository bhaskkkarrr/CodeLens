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
  const [repositories, setRepositories] = useState(null);
  const getAllRepositories = async () => {
    try {
      setIsGettingRepos(true);
      const res = await axiosInstance.get("/api/git/repositories");
      console.log(res.data);
      setRepositories(res.data.repositories);
    } catch (error) {
      toast.error(
        error.response?.message ||
          error.response ||
          error.message ||
          "Something went wrong",
      );
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
    try {
      setIsImportingRepository(true);
      const res = await axiosInstance.post("/api/git/clone", {
        repoId: id,
      });
      if(res.success){
        toast.success("Repository cloned successfully")
      }
    } catch (error) {
      toast.error(
        error?.response?.message ||
          error?.response?.data ||
          error.message ||
          "Something went wrong",
      );
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
        repositories,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export const useGithub = () => {
  return useContext(GithubContext);
};

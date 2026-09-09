import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { createContext } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  auth,
  githubAuthProvider,
  googleAuthProvider,
} from "../services/firebaseAuth";
import { axiosInstance } from "../services/axiosInstance";
import toast from "react-hot-toast";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  function tokenAndUser(data) {
    setToken(data.token);
    setUser(data.user);
  }

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,

      async (error) => {
        const originalRequest = error.config;

        if (!error.response) {
          return Promise.reject(error);
        }

        const isUnauthorized =
          error.response.status === 403 &&
          error.response?.data?.message === "Unauthorized";

        const alreadyRetried = originalRequest?._retry;

        const isAuthRequest = originalRequest?.url === "/api/auth/me";

        if (isUnauthorized && !alreadyRetried && !isAuthRequest) {
          originalRequest._retry = true;

          try {
            const res = await axiosInstance.get("/api/auth/me");

            const newToken = res.data.token;
            const newUser = res.data.user;

            setToken(newToken);
            setUser(newUser);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            setToken(null);
            setUser(null);

            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const googleSubmit = async () => {
    try {
      setIsAuthenticating(true);

      const res = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await auth.currentUser.getIdToken();
      console.log("Current User", idToken);
      const googleResponse = await axiosInstance.post(
        "/api/auth/firebase-auth",
        {},
        {
          headers: { Authorization: `Bearer ${idToken}` },
        },
      );
      tokenAndUser(googleResponse.data);

      toast.success("Logged in successfully!!");
      return { success: true };
    } catch (error) {
      console.log(error);
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Use your original sign in method to sign in and try again",
          {
            duration: 7000,
          },
        );
      } else {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Something went wrong. try again !!",
        );
      }
      return { success: false };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const gitHubSubmit = async () => {
    try {
      setIsAuthenticating(true);
      const res = await signInWithPopup(auth, githubAuthProvider);
      const idToken = await auth.currentUser.getIdToken();
      console.log("Current User", idToken);
      const gitResponse = await axiosInstance.post(
        "/api/auth/firebase-auth",
        {},
        {
          headers: { Authorization: `Bearer ${idToken}` },
        },
      );
      tokenAndUser(gitResponse.data);
      toast.success("Logged in successfully!!");
      return { success: true };
    } catch (error) {
      console.log(error);
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Use your original sign in method to sign in and try again",
          {
            duration: 7000,
          },
        );
      } else {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Something went wrong. try again !!",
        );
      }
      return { success: false };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const emailLoginSubmit = async (email, password) => {
    try {
      setIsAuthenticating(true);
      const res = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await auth.currentUser.getIdToken();
      console.log("Current User", idToken);
      const loginResponse = await axiosInstance.post(
        "/api/auth/login",
        {},
        { headers: { Authorization: `Bearer ${idToken}` } },
      );
      toast.success("Login successful!!");
      tokenAndUser(loginResponse.data);
      console.log("Res", loginResponse.data);
      return { success: true };
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong. try again !!",
      );
      return { success: false };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const emailRegisterSubmit = async (email, password, username) => {
    try {
      setIsAuthenticating(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await auth.currentUser.getIdToken();
      console.log("Current User", idToken);
      const registerResponse = await axiosInstance.post(
        "/api/auth/register",
        { username, password },
        { headers: { Authorization: `Bearer ${idToken}` } },
      );
      toast.success("Sign up successful!! You can now login");
      console.log("Res", registerResponse.data);
      return { success: true };
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong. try again !!",
      );
      return { success: false };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const verifyOTP = async (otp) => {
    try {
      setIsAuthenticating(true);
      const idToken = await auth.currentUser.getIdToken();
      console.log("idToken", idToken);
      const res = await axiosInstance.post(
        "/api/auth/verify-otp",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );
      console.log(res.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong. try again !!",
      );
      return { success: false };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getAccessToken = async () => {
    try {
      setIsAuthenticating(true);
      const res = await axiosInstance.get("/api/auth/me");
      tokenAndUser(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAuthenticating(false);
    }
  };
  useEffect(() => {
    getAccessToken();
  }, []);

  console.log("User", user);
  console.log("Token", token);

  const githubDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      const res = await axiosInstance.get("/api/auth/disconnect-github");
      if (res.data.success) {
        await getAccessToken();
        toast.success("Github disconnected successfully ");
      }
    } catch (error) {
      toast.error(
        error.response.message || error.response.data || "Something went wrong",
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        googleSubmit,
        gitHubSubmit,
        emailRegisterSubmit,
        emailLoginSubmit,
        githubDisconnect,
        isAuthenticating,
        isAuthLoading,
        isDisconnecting,
        verifyOTP,
        token,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

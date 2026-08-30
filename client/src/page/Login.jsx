import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GithubAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  auth,
  githubAuthProvider,
  googleAuthProvider,
} from "../services/firebaseAuth";
import { axiosInstance } from "../services/axiosInstance";

const Login = () => {
  const [isLoginState, setIsLoginState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState("");
  const { register, handleSubmit } = useForm();
  const handleGoogleSubmit = async () => {
    try {
      const res = await signInWithPopup(auth, googleAuthProvider);
      const cuurentUser = await auth.currentUser.getIdToken();
      console.log(cuurentUser);
      console.log("Res", res);
      const backendRes = await axiosInstance.post(
        "/api/auth/firebase-auth",
        {},
        {
          headers: { Authorization: `Bearer ${cuurentUser}` },
        },
      );
      console.log(backendRes);
    } catch (error) {
      console.log(error);
      setErrors(error.code || "Something went wrong");
      if (error.code === "auth/account-exists-with-different-credential") {
        console.log("Account exists with another provider");
      }
    }
  };
  const handleGitHubSubmit = async () => {
    try {
      const res = await signInWithPopup(auth, githubAuthProvider);
      const cuurentUser = await auth.currentUser.getIdToken();
      const backendRes = await axiosInstance.post(
        "/api/auth/firebase-auth",
        {},
        {
          headers: { Authorization: `Bearer ${cuurentUser}` },
        },
      );
      console.log(cuurentUser);
      console.log(backendRes.data);
      console.log("Res", res);
    } catch (error) {
      console.log(error);
      setErrors(error.code || "Something went wrong");
      if (error.code === "auth/account-exists-with-different-credential") {
        console.log("Account exists with another provider");
      }
    }
  };
  const handleEmailLoginSubmit = async ({ email, password }) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await auth.currentUser.getIdToken();
      console.log("Res", res);
      const loginResponse = await axiosInstance.post(
        "/api/auth/login",
        {},
        { headers: { Authorization: `Bearer ${idToken}` } },
      );
      console.log("Res", loginResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailRegisterSubmit = async ({
    email,
    password,
    confirmPassword,
    username,
  }) => {
    if (password !== confirmPassword) {
      setErrors("Passwords doesn't match");
      console.log("Incorrect password");
    } else {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Res", res);
      const idToken = await auth.currentUser.getIdToken();
      const registerResponse = await axiosInstance.post(
        "/api/auth/register",
        { username, password },
        { headers: { Authorization: `Bearer ${idToken}` } },
      );
      console.log("Res", registerResponse.data);
    }
  };
  return (
    <>
      {/* Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 overflow-hidden bg-hunter-green-950"
      >
        {/* base vertical gradient, deep hunter-green */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#182619_0%,#1a2517_38%,#152012_75%,#111a0f_100%)]" />

        {/* large soft color blooms for depth */}
        <motion.div className="absolute -top-40 animate-pulse -left-32 h-152 w-152 rounded-full bg-norway-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-136 animate-pulse w-136 rounded-full bg-norway-500/40 blur-[130px]" />
        <div className="absolute -bottom-48 left-1/ animate-pulse h-120 w-120 rounded-full bg-norway-700/30 blur-[110px]" />

        {/* fine graph-paper grid, like an editor's line/column guides */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#acc8a2_1px,transparent_1px),linear-gradient(90deg,#acc8a2_1px,transparent_1px)] bg-size-[44px_44px] sm:bg-size-[56px_56px]" />
      </div>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl flex items-center justify-center my-5 md:my-0 mx-auto min-h-screen p-4 md:p-8 "
      >
        <div className="grid items-center gap--10 bg-norway-200 shadow-lg shadow-norway-100/30 rounded-lg overflow-hidden md:grid-cols-3">
          <div className="md:flex flex-col hidden justify-center space-y-6 min-h-full bg-linear-to-r from-hunter-green-600 to-hunter-green-700 p-6 max-md:order-1 md:space-y-16">
            <div>
              <h2 className="text-white text-lg font-semibold font-mono dark:text-slate-50">
                CodeLens
              </h2>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                Connect.Analyse.Ask
              </p>
            </div>
            <div>
              <h2 className="text-white text-lg font-medium dark:text-slate-50">
                Simple & Secure Authentication
              </h2>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                Our authentication process is designed to be straightforward and
                secure. We prioritize your privacy and data security.
              </p>
            </div>
            {isLoginState ? (
              <div className="mt-6 text-norway-50 text-sm text-center">
                Getting Started?
                <div
                  className="text-hunter-green-50 cursor-pointer underline ml-1 font-medium rounded"
                  onClick={() => setIsLoginState(false)}
                >
                  SignUp here
                </div>
              </div>
            ) : (
              <div className="mt-6 text-norway-50 text-sm text-center">
                Already have an account?
                <div
                  className="text-hunter-green-50 cursor-pointer underline ml-1 font-medium rounded"
                  onClick={() => setIsLoginState(true)}
                >
                  Login here
                </div>
              </div>
            )}
          </div>

          <div className="w-full py-6 px-6 max-w-lg mx-auto md:col-span-2 md:px-14">
            {isLoginState ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.9,
                  },
                }}
              >
                <div className="mb-10">
                  <h1 className="text-hunter-green-800 text-center text-2xl font-bold">
                    Login to your account
                  </h1>
                </div>
                <form
                  className="space-y-6"
                  onSubmit={handleSubmit((body) =>
                    handleEmailLoginSubmit(body),
                  )}
                >
                  {/* Email */}
                  <div className="">
                    <label
                      htmlFor="email"
                      className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@readymadeui.com"
                      required
                      className="px-3 py-2.5 text-sm w-full text-hunter-green-800 rounded-xl bg-white outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-hunter-green-600"
                      {...register("email", { required: true })}
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="">
                    <label
                      htmlFor="password"
                      className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
                    >
                      Password
                    </label>
                    <div className="flex justify-between px-5 py-2.5 rounded-xl items-center bg-white w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder=". . . . . ."
                        required
                        className=" text-sm w-full text-slate-900 outline-none "
                        {...register("password", { required: true })}
                      />
                      <div
                        className="text-norway-500 cursor-pointer transition-all duration-300"
                        onClick={() => {
                          if (showPassword) {
                            setShowPassword(false);
                          } else {
                            setShowPassword(true);
                          }
                        }}
                      >
                        {showPassword ? (
                          <IoEyeOffSharp size={20} />
                        ) : (
                          <IoEye size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full py-2 px-3.5 text-sm rounded-xl font-semibold cursor-pointer tracking-wide text-white border border-hunter-green-600 bg-linear-to-r from-hunter-green-400 to-hunter-green-500"
                  >
                    Login
                  </motion.button>
                </form>

                <div className="mt-6 block md:hidden text-hunter-green-700 text-sm text-center">
                  Getting Started?
                  <div
                    className="text-hunter-green-800 cursor-pointer underline ml-1 font-medium rounded"
                    onClick={() => setIsLoginState(false)}
                  >
                    SignUp here
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.9,
                  },
                }}
              >
                <div className="mb-10">
                  <h1 className="text-hunter-green-800 text-center text-2xl font-bold">
                    Create an account
                  </h1>
                </div>
                <form
                  className="space-y-6"
                  onSubmit={handleSubmit((body) =>
                    handleEmailRegisterSubmit(body),
                  )}
                >
                  {/* Email */}
                  <div className="">
                    <label
                      htmlFor="email"
                      className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@readymadeui.com"
                      required
                      className="px-3 py-2.5 text-sm text-hunter-green-800 rounded-xl bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-hunter-green-600"
                      {...register("email", { required: true })}
                    />
                  </div>

                  {/* Username */}
                  <div className="">
                    <label
                      htmlFor="username"
                      className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="John Doe"
                      required
                      className="px-3 py-2.5 text-sm text-hunter-green-800 rounded-xl bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-hunter-green-600"
                      {...register("username", { required: true })}
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="">
                    <label
                      htmlFor="password"
                      className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
                    >
                      Password
                    </label>
                    <div className="flex justify-between px-5 py-2.5 rounded-xl items-center bg-white w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder=". . . . . ."
                        required
                        className=" text-sm text-slate-900 outline-none "
                        {...register("password", { required: true })}
                      />
                      <div
                        className="text-norway-500 cursor-pointer transition-all duration-300"
                        onClick={() => {
                          if (showPassword) {
                            setShowPassword(false);
                          } else {
                            setShowPassword(true);
                          }
                        }}
                      >
                        {showPassword ? (
                          <IoEyeOffSharp size={20} />
                        ) : (
                          <IoEye size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="">
                    <label
                      htmlFor="confirm-password"
                      className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50"
                    >
                      Confirm password
                    </label>
                    <div className="flex justify-between px-5 py-2.5 rounded-xl items-center bg-white w-full">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        name="confirm-password"
                        placeholder=". . . . . ."
                        required
                        className="text-sm text-hunter-green-800 outline-none"
                        {...register("confirmPassword", { required: true })}
                      />
                      <div
                        className="text-norway-500 cursor-pointer transition-all duration-300"
                        onClick={() => {
                          if (showConfirmPassword) {
                            setShowConfirmPassword(false);
                          } else {
                            setShowConfirmPassword(true);
                          }
                        }}
                      >
                        {showConfirmPassword ? (
                          <IoEyeOffSharp size={20} />
                        ) : (
                          <IoEye size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full py-2 px-3.5 text-sm rounded-xl font-semibold cursor-pointer tracking-wide text-white border border-hunter-green-600 bg-linear-to-r from-hunter-green-400 to-hunter-green-500"
                  >
                    Create an account
                  </motion.button>
                </form>

                <div className="mt-6 block md:hidden text-hunter-green-700 text-sm text-center">
                  Already have an account?
                  <div
                    className="text-hunter-green-800 cursor-pointer underline ml-1 font-medium rounded"
                    onClick={() => setIsLoginState(true)}
                  >
                    Login here
                  </div>
                </div>
              </motion.div>
            )}
            <div className="">
              <div className="relative my-2 text-center">
                <span className="relative z-10 px-3 text-norway-400">
                  ----- Or continue with -----
                </span>
              </div>
              <div className="flex justify-center items-center gap-5">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  className="flex p-2 items-center justify-center gap-2 rounded-xl bg-hunter-green-800 text-gray-300 hover:bg-gray-900"
                  onClick={() => handleGitHubSubmit()}
                >
                  <FaGithub />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  type="button"
                  className=" flex p-2 cursor-pointer items-center justify-center gap-2 rounded-xl bg-hunter-green-800 text-gray-300 hover:bg-gray-900"
                  onClick={() => handleGoogleSubmit()}
                >
                  <FcGoogle />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default Login;

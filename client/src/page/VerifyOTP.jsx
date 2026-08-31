import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
const VerifyOTP = () => {
  const { register, handleSubmit } = useForm();
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const handleVerifyOtp = async ({ otp }) => {
    const res = await verifyOTP(otp);
    if (res.success) {
      navigate("/");
    }
  };
  return (
    <div className="min-h-screen max-w-4xl px-5  mx-auto flex justify-center items-center  ">
      <div className="bg-linear-to-br   from-hunter-green-100 to-hunter-green-300 rounded-3xl shadow-lg shadow-norway-300/60 md:p-10 py-7 px-5 text-norway-600">
        <h1 className="text-center text-3xl md:text-5xl font-semibold">OTP Verification</h1>
        <div className="flex gap-5 md:my-7 my-4 justify-center flex-col items-center">
          <form
            action="submit"
            onSubmit={handleSubmit((body) => handleVerifyOtp(body))}
            className="flex gap-5 justify-center flex-col items-center"
          >
            <input
              type="text"
              placeholder="Enter your otp here..."
              className="outline-none bg-hunter-green-100 rounded-2xl py-2 px-5 md:px-10 placeholder:text-norway-500 text-norway-700 text-2xl"
              {...register("otp", { required: true })}
            />
            <motion.input
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.89 }}
              type="submit"
              value="Verify"
              className="bg-hunter-green-300 outline-none rounded-xl px-4 py-2 text-norway-800 hover:text-norway-50 hover:bg-hunter-green-400 shadow-lg shadow-hunter-green-400"
            />
          </form>
          <span className="flex gap-5 text-hunter-green-900">
            <p>Didn't received otp? </p>
            <span className="underline text-norway-500 cursor-pointer">
              Resend
            </span>
          </span>
          {/* {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              type="text"
              className="h-10 w-10 bg-amber-50 rounded-xl placeholder:text-amber-700"
            />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;


import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] p-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-200">Syllabyte</h1>
          <p className="text-gray-400">Big Ideas, Byte-Sized</p>
        </div>

        <div className="rounded-2xl bg-[#1A1A1A] shadow-xl">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm />
                <div className="mt-4 pb-6 text-center text-sm text-gray-400">
                  <p>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="font-semibold text-red-500 hover:text-red-400"
                    >
                      Create one
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RegisterForm />
                <div className="mt-4 pb-6 text-center text-sm text-gray-400">
                  <p>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="font-semibold text-red-500 hover:text-red-400"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;

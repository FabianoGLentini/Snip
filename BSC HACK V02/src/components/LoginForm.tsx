
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, User, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const response = await fetch("http://localhost:3000/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            username: formData.username,
            password: formData.password,
          },
        }),
        credentials: "include", // Ensures cookies (sessions) are sent
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/"); // Navigate to home/video feed
      } else {

        toast({
          title: "Login failed",
          description: data.errors.join(", "),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",

        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-200">Sign In</h2>
      
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-300">
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <User size={18} />
          </div>
          <Input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="h-12 w-full bg-[#1E293B] pl-10 text-gray-200 placeholder-gray-500 border-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-300">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <Key size={18} />
          </div>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="h-12 w-full bg-[#1E293B] pl-10 text-gray-200 placeholder-gray-500 border-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-md bg-red-600 font-medium text-white hover:bg-red-700"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </div>

      <div className="text-center">
        <a href="#" className="text-sm font-medium text-gray-400 hover:text-gray-300">
          Forgot password?
        </a>
      </div>
    </form>
  );
};

export default LoginForm;

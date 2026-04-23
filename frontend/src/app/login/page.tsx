"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon, ChevronDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data } = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        toast.success("Welcome back!");
        login({ id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      } else {
        const { data } = await axios.post("http://localhost:5000/api/auth/register", {
          name,
          email,
          password,
          role,
        });
        toast.success("Account created successfully!");
        login({ id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-bg.png"
          alt="Delicious food background"
          fill
          className="object-cover object-center brightness-[0.4]"
          priority
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6 py-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">CRAVINGS</h1>
          <p className="text-white/70">
            {isLogin ? "Sign in to satisfy your cravings" : "Join us and start ordering"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all cursor-pointer"
              >
                <option value="User" className="text-black">User</option>
                <option value="Sub-admin" className="text-black">Sub-admin</option>
                <option value="Admin" className="text-black">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-6"
          >
            {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

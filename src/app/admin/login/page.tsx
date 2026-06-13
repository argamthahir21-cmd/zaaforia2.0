"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid admin credentials");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-jost text-[#E8E5E0] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4A5A0]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-[#050505] border border-[#1A1A1A] p-10 rounded-[32px] shadow-2xl relative overflow-hidden group">
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8C4BC]/40 to-transparent  group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 bg-[#111111] border border-[#222222] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
            >
              <ShieldCheck size={24} className="text-espresso" />
            </motion.div>
            <h1 className="text-3xl font-playfair uppercase tracking-[0.25em] font-medium text-[#F7F4EF]">
              Zaaforia
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-espresso mt-3 font-semibold">
              Owner Access Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="p-4 bg-[#C47A7A]/10 border border-[#C47A7A]/30 rounded-2xl flex items-center gap-3 text-left"
                >
                  <AlertCircle size={16} className="text-[#C47A7A] flex-shrink-0" />
                  <p className="text-[11px] text-[#C47A7A] uppercase tracking-wider font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="relative group/input">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444] group-focus-within/input:text-espresso transition-colors duration-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] py-4 pl-14 pr-5 rounded-2xl text-[13px] text-[#F7F4EF] focus:outline-none focus:border-[#C8C4BC]/50 focus:bg-[#0F0F0F] transition-all duration-300 placeholder:text-[#444444] placeholder:uppercase placeholder:tracking-widest"
                />
              </div>

              <div className="relative group/input">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444] group-focus-within/input:text-espresso transition-colors duration-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] py-4 pl-14 pr-5 rounded-2xl text-[13px] text-[#F7F4EF] focus:outline-none focus:border-[#C8C4BC]/50 focus:bg-[#0F0F0F] transition-all duration-300 placeholder:text-[#444444] placeholder:uppercase placeholder:tracking-widest"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 bg-[#E8E5E0] hover:bg-white text-black rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-colors mt-2 shadow-[0_0_20px_rgba(232,229,224,0.1)] hover:shadow-[0_0_25px_rgba(232,229,224,0.2)] disabled: disabled:hover:scale-100"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Authenticate Identity"}
            </motion.button>
          </form>

          <div className="mt-10 text-center flex flex-col items-center">
            <div className="w-12 h-[1px] bg-[#222222] mb-6" />
            <p className="text-[9px] text-[#555555] uppercase tracking-[0.2em]">
              Unauthorised access is strictly prohibited
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

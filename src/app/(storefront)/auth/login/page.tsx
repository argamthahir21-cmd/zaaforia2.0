"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Sparkles, Gem, ShoppingBag } from "lucide-react";
import { useLogin, useRegister } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useAuthStore, useSceneStore } from "@/lib/store";
import { signIn, getSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { setSceneState } = useSceneStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const registerMutation = useRegister();

  const isLoading = registerMutation.isPending || authLoading;
  const errorMsg = authError || (registerMutation.error as any)?.message;

  useEffect(() => {
    setSceneState("login");
  }, [setSceneState]);

  useEffect(() => {
    // Only auto-redirect if already logged in on initial load, 
    // to prevent racing with NextAuth's cookie setting during login.
    if (useAuthStore.getState().isAuthenticated) {
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl") || "/";
      router.push(callbackUrl);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (!isLogin) {
      if (password.length < 8) {
        setValidationError("Password must be at least 8 characters long.");
        return;
      }
      if (!/(?=.*[0-9])/.test(password)) {
        setValidationError("Password must contain at least one number.");
        return;
      }
    }

    if (isLogin) {
      setAuthLoading(true);
      setAuthError("");
      signIn("credentials", {
        email,
        password,
        redirect: false,
      }).then(async (result) => {
        if (result?.error) {
          setAuthError(result.error);
          setAuthLoading(false);
        } else {
          const session = await getSession();
          if (session?.user) {
            useAuthStore.getState().setAuth({
              id: (session.user as any).id || "",
              name: session.user.name || "",
              email: session.user.email || "",
              role: (session.user as any).role || "user",
              loyaltyPoints: (session.user as any).loyaltyPoints || 0,
            }, "next-auth-token");
          }
          const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
          router.push(callbackUrl || "/");
        }
      }).catch((err) => {
        console.error("NextAuth login error:", err);
        setAuthError("Authentication failed");
        setAuthLoading(false);
      });
    } else {
      registerMutation.mutate({ name, email, password }, {
        onSuccess: () => router.push("/")
      });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[540px] relative z-10"
      >
        {/* Glass Card */}
        <div className="glass p-12 rounded-[40px] border border-white/20 shadow-luxury-xl relative overflow-hidden">
          {/* Internal Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <Link href="/" className="inline-block group">
              <motion.div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="text-gold w-5 h-5 group-hover:rotate-12 transition-transform" />
                <h1 className="font-playfair text-4xl font-bold tracking-[0.2em] text-espresso uppercase">
                  ZA<span className="text-rose">A</span>FORIA
                </h1>
              </motion.div>
              <div className="w-12 h-[1px] bg-gold mx-auto group-hover:w-24 transition-all duration-500" />
            </Link>
          </div>

          {/* Sign In / Register Tabs */}
          <div className="flex bg-white/30 p-1.5 rounded-2xl mb-8 relative border border-white/40 shadow-inner">
            <button
              onClick={() => { setIsLogin(true); setValidationError(""); }}
              className={`flex-1 py-4 text-sm md:text-base font-poppins font-semibold uppercase tracking-wider rounded-xl transition-all ${isLogin ? 'bg-white shadow-sm text-espresso' : 'text-espresso/60 hover:text-espresso'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setValidationError(""); }}
              className={`flex-1 py-4 text-sm md:text-base font-poppins font-semibold uppercase tracking-wider rounded-xl transition-all ${!isLogin ? 'bg-white shadow-sm text-espresso' : 'text-espresso/60 hover:text-espresso'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {validationError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose/10 border border-rose/30 rounded-xl text-rose text-base font-poppins text-center">
                {validationError}
              </motion.div>
            )}
            
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose/10 border border-rose/30 rounded-xl text-rose text-base font-poppins text-center">
                {errorMsg}
              </motion.div>
            )}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="relative group"
                >
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 flex-shrink-0 text-espresso group-focus-within:text-rose transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    style={{ paddingLeft: "4rem" }}
                    className="w-full h-[64px] md:h-[72px] bg-white/40 border border-white/40 pr-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-rose focus:bg-white/80 transition-all shadow-inner leading-normal"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 flex-shrink-0 text-espresso group-focus-within:text-gold transition-colors" />
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: "4rem" }}
                className="w-full h-[64px] md:h-[72px] bg-white/40 border border-white/40 pr-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold focus:bg-white/80 transition-all shadow-inner leading-normal"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 flex-shrink-0 text-espresso group-focus-within:text-gold transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: "4rem" }}
                className="w-full h-[64px] md:h-[72px] bg-white/40 border border-white/40 pr-16 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold focus:bg-white/80 transition-all shadow-inner leading-normal"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-espresso hover:text-espresso flex-shrink-0"
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>

            <div className="flex items-center justify-between px-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className="w-6 h-6 flex-shrink-0 border-2 border-gold/50 rounded flex items-center justify-center group-hover:border-gold transition-colors">
                  <div className={`w-3 h-3 bg-gold rounded-sm transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0 group-hover:opacity-20'}`} />
                </div>
                <span className="text-base font-poppins text-espresso tracking-wide">Remember me</span>
              </label>
              <Link href="#" className="text-base font-poppins text-gold hover:text-rose tracking-wide transition-colors">
                Forgot Password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-[64px] md:h-[72px] bg-espresso text-white rounded-2xl font-poppins text-lg font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 relative overflow-hidden group shadow-lg mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  {isLogin ? "Enter Universe" : "Initialize Journey"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center hidden">
            <p className="text-[10px] font-poppins text-espresso uppercase tracking-widest mb-6">
              {isLogin ? "New to the fashion world?" : "Already part of the elite?"}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-playfair italic font-semibold text-rose hover:text-gold transition-colors underline underline-offset-8 decoration-rose/30"
            >
              {isLogin ? "Join ZAaforia Today" : "Access Existing Account"}
            </button>
          </div>
        </div>

        {/* Brand Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-[8px] font-poppins text-espresso uppercase tracking-[0.5em]">
            &copy; 2026 ZAaforia Couture Digital
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Activity, Mail, Lock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isLogin) {
      // Login with NextAuth
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } else {
      // Register logic
      if (!name || !email || !password) {
        setError("All fields are required");
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
        
        if (res.ok) {
          setIsLogin(true);
          setError("Account created! Please log in.");
        } else {
          const data = await res.json();
          setError(data.message || "Registration failed");
        }
      } catch (err) {
        setError("Something went wrong");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass w-full max-w-md p-8 rounded-[2rem] border border-white/20 dark:border-white/10 shadow-2xl shadow-black/5"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-soft p-3 rounded-2xl text-white shadow-[0_0_20px_var(--glow)]">
            <Activity className="w-8 h-8" />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-center mb-2">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-secondary text-center mb-6 text-sm">
          {isLogin ? "Enter your details to access your dashboard." : "Start your health journey today."}
        </p>

        {error && (
          <div className={`p-3 rounded-xl mb-4 text-sm text-center font-medium border ${error.includes("created") ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary pl-1">Full Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          )}

          <div className="space-y-1 relative">
            <label className="text-sm font-medium text-secondary pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-background/50 border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className="text-sm font-medium text-secondary pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background/50 border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                required
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">Forgot password?</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 mt-4 rounded-xl bg-foreground text-background font-bold hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-secondary">
          <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="font-bold text-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "Sign up now" : "Log in"}
          </button>
        </div>
      </motion.div>
      
      <div className="absolute bottom-8 flex items-center gap-2 text-xs text-secondary/60">
        <AlertCircle className="w-4 h-4" /> Secure 256-bit SSL encryption
      </div>
    </div>
  );
}

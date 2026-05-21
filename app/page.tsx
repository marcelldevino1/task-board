"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    window.location.href = "/dashboard";
    alert("Login berhasil! Menuju dashboard...");
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 antialiased selection:bg-white selection:text-black">
      
      {/* Kartu Login Minimalis */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm p-8 rounded-xl border border-zinc-800 bg-black shadow-2xl"
      >
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            StreamDesk
          </h1>
          <p className="text-sm text-zinc-400">
            Masuk ke workspace turnamen PUBG.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Email / Username
            </label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:border-white focus:outline-none transition-colors duration-200 placeholder-zinc-600"
              placeholder="nama@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Password
              </label>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:border-white focus:outline-none transition-colors duration-200 placeholder-zinc-600"
              placeholder="••••••••"
            />
          </div>

          {/* Tombol Putih Clean */}
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "#e4e4e7" }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full mt-2 py-2.5 rounded-lg bg-white text-black text-sm font-medium transition-colors duration-200 shadow-md"
          >
            Masuk
          </motion.button>
        </form>
      </motion.div>

    </div>
  );
}
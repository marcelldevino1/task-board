"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileVideo, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State untuk menahan layar agar tidak kedip saat ngecek memori
  const [isChecking, setIsChecking] = useState(true); 
  const router = useRouter();

  // Efek ini langsung jalan saat web pertama kali dibuka
  useEffect(() => {
    const savedUser = localStorage.getItem("streamdesk_user");
    if (savedUser) {
      // Kalau ketemu datanya, langsung tendang ke dashboard!
      router.push("/dashboard");
    } else {
      // Kalau kosong, baru tampilkan form login
      setIsChecking(false);
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simpan data user ke memori browser (localStorage)
    const userData = { name, email };
    localStorage.setItem("streamdesk_user", JSON.stringify(userData));
    
    // Pindah ke halaman dashboard
    router.push("/dashboard");
  };

  // Selama web masih ngecek memori, tampilkan layar kosong (atau bisa diganti icon loading)
  if (isChecking) {
    return <div className="min-h-screen bg-[#f7f8fa]"></div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col justify-center items-center p-4 antialiased selection:bg-blue-200 selection:text-blue-900">

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Login gece</h1>
          <p className="text-sm text-gray-500 mt-2">Masuk untuk mengelola workspace turnamen.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Input Nama */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Misal: Jesrel"
            />
          </div>

          {/* Input Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="nama@email.com"
            />
          </div>

          {/* Input Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            Masuk Workspace
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>

      <p className="mt-8 text-xs text-gray-400 font-medium">© 2026 StreamDesk App.</p>
    </div>
  );
}
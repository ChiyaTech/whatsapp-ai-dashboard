"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/register", { email, password });
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/onboarding");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600";

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            CHIYA<span className="text-indigo-400">TECH</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2">AI Sales Employee for your business</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {/* Tab Toggle */}
          <div className="flex gap-2 mb-8 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                mode === "login"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                mode === "register"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? handleLogin() : handleRegister())}
              className={inputClass}
            />

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              onClick={mode === "login" ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-xl py-3 hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
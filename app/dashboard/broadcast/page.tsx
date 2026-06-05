"use client";
import { useState } from "react";
import API from "@/lib/api";

export default function BroadcastPage() {
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleBroadcast = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await API.post("/broadcast", { message, filter });
      setResult(res.data);
      setMessage("");
    } catch {
      setResult({ error: "Broadcast failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
          📢 Broadcast
        </h2>
        <p className="text-slate-600 text-sm">Sab leads ko ek saath message bhejo</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
          Kisko bhejein?
        </p>
        <div className="flex gap-2">
          {[
            { key: "ALL", label: "Sabko" },
            { key: "HOT", label: "🔥 Hot" },
            { key: "WARM", label: "Warm" },
            { key: "COLD", label: "Cold" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                filter === f.key
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="mb-6">
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
          Message
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Aapka message yahan likhein..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-slate-600"
        />
        <p className="text-slate-700 text-xs mt-2">{message.length} characters</p>
      </div>

      {/* Send Button */}
      <button
        onClick={handleBroadcast}
        disabled={loading || !message.trim()}
        className="w-full py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Bhej raha hoon..." : "📢 Broadcast Karo"}
      </button>

      {/* Result */}
      {result && (
        <div className={`mt-6 p-5 rounded-2xl border ${result.error ? "border-red-500/20 bg-red-500/10" : "border-green-500/20 bg-green-500/10"}`}>
          {result.error ? (
            <p className="text-red-400 text-sm font-bold">{result.error}</p>
          ) : (
            <div>
              <p className="text-green-400 font-black text-sm mb-2">✅ Broadcast Complete!</p>
              <p className="text-slate-400 text-xs">Total: {result.total} | Sent: {result.sent} | Failed: {result.failed}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
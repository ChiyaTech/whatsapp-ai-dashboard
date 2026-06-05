"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState<string | null>(null);

  const fetchLeads = () => {
    API.get("/leads").then((res) => setLeads(res.data));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleTakeover = async (leadId: string) => {
    setLoading(leadId);
    try {
      await API.patch(`/leads/${leadId}`, { isHumanHandled: true });
      fetchLeads();
    } catch {
      alert("Failed. Try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleHandBack = async (leadId: string) => {
    setLoading(leadId);
    try {
      await API.patch(`/leads/${leadId}`, { isHumanHandled: false });
      fetchLeads();
    } catch {
      alert("Failed. Try again.");
    } finally {
      setLoading(null);
    }
  };

  const filtered = filter === "ALL"
    ? leads
    : leads.filter((l) => l.status === filter);

  const statusColor: any = {
    HOT: "text-red-400 bg-red-500/10 border-red-500/20",
    WARM: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    COLD: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Leads</h2>
        <p className="text-slate-600 text-sm">{leads.length} total leads</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {["ALL", "HOT", "WARM", "COLD"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {f} {f !== "ALL" && `(${leads.filter((l) => l.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Leads */}
      <div className="flex flex-col gap-3">
        {filtered.map((lead) => (
          <div
            key={lead.id}
            className={`border rounded-2xl px-6 py-4 flex items-center justify-between transition-all ${
              lead.isHumanHandled
                ? "bg-indigo-600/10 border-indigo-500/20"
                : "bg-white/5 border-white/10 hover:bg-white/8"
            }`}
          >
            {/* Left — Info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-sm">{lead.phone}</p>
                {lead.isHumanHandled && (
                  <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    👤 Human
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs">{lead.interest ?? "—"}</p>
              <p className="text-slate-700 text-[10px]">
                Followups: {lead.followupCount ?? 0} • {new Date(lead.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            {/* Right — Status + Buttons */}
            <div className="flex flex-col items-end gap-2">
              <span className={`text-xs font-black px-3 py-1 rounded-full border uppercase ${statusColor[lead.status]}`}>
                {lead.status}
              </span>

              {/* Take Over — sirf HOT lead pe */}
              {lead.status === "HOT" && !lead.isHumanHandled && (
                <button
                  onClick={() => handleTakeover(lead.id)}
                  disabled={loading === lead.id}
                  className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                  {loading === lead.id ? "..." : "🤝 Take Over"}
                </button>
              )}

              {/* Hand Back — jab human handle kar raha ho */}
              {lead.isHumanHandled && (
                <button
                  onClick={() => handleHandBack(lead.id)}
                  disabled={loading === lead.id}
                  className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                  {loading === lead.id ? "..." : "🤖 Hand to AI"}
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-slate-600 text-sm">Koi lead nahi.</p>
        )}
      </div>
    </div>
  );
}
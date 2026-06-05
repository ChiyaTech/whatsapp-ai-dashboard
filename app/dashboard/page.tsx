"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({ hot: 0, warm: 0, cold: 0, total: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    API.get("/leads").then((res) => {
      const leads = res.data;
      setStats({
        total: leads.length,
        hot: leads.filter((l: any) => l.status === "HOT").length,
        warm: leads.filter((l: any) => l.status === "WARM").length,
        cold: leads.filter((l: any) => l.status === "COLD").length,
      });
      setRecentLeads(leads.slice(0, 5));
    });
  }, []);

  const cards = [
    { label: "Total Leads", value: stats.total, color: "text-white", border: "border-white/10" },
    { label: "Hot Leads 🔥", value: stats.hot, color: "text-red-400", border: "border-red-500/20" },
    { label: "Warm Leads", value: stats.warm, color: "text-yellow-400", border: "border-yellow-500/20" },
    { label: "Cold Leads", value: stats.cold, color: "text-blue-400", border: "border-blue-500/20" },
  ];

  const statusColor: any = {
    HOT: "text-red-400 bg-red-500/10 border-red-500/20",
    WARM: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    COLD: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Overview</h2>
        <p className="text-slate-600 text-sm">Aaj ka status dekho</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`bg-white/5 border ${card.border} rounded-2xl p-6`}>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
              {card.label}
            </p>
            <p className={`text-4xl font-black ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Recent Leads
          </h3>
          <Link href="/dashboard/leads" className="text-xs font-black text-indigo-400 hover:text-white transition-colors no-underline">
            View All →
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {recentLeads.map((lead: any) => (
            <div key={lead.id} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">{lead.phone}</p>
                <p className="text-slate-500 text-xs mt-1">{lead.interest ?? "—"}</p>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full border uppercase ${statusColor[lead.status]}`}>
                {lead.status}
              </span>
            </div>
          ))}
          {recentLeads.length === 0 && (
            <p className="text-slate-600 text-sm">Koi lead nahi abhi.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/broadcast" className="no-underline bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 hover:bg-indigo-600/20 transition-all">
            <p className="text-indigo-400 font-black text-sm uppercase tracking-widest mb-1">📢 Broadcast</p>
            <p className="text-slate-500 text-xs">Sab leads ko ek saath message bhejo</p>
          </Link>
          <Link href="/dashboard/chats" className="no-underline bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all">
            <p className="text-white font-black text-sm uppercase tracking-widest mb-1">💬 Chats</p>
            <p className="text-slate-500 text-xs">Customer conversations dekho</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
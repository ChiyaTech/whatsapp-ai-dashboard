"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function ChatsPage() {
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    API.get("/leads").then((res) => setLeads(res.data));
  }, []);

  const loadChat = (phone: string) => {
    setSelected(phone);
    API.get(`/chats/${phone}`).then((res) => setChats(res.data));
  };

  return (
    <div className="flex gap-6 h-[80vh]">
      {/* Left — Lead list */}
      <div className="w-64 flex flex-col gap-2 overflow-auto">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
          Conversations
        </h2>
        {leads.map((lead: any) => (
          <button
            key={lead.id}
            onClick={() => loadChat(lead.phone)}
            className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              selected === lead.phone
                ? "bg-indigo-600 text-white"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {lead.phone}
          </button>
        ))}
      </div>

      {/* Right — Chat */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 overflow-auto flex flex-col gap-3">
        {!selected && (
          <p className="text-slate-600 text-sm">Select a conversation</p>
        )}
        {chats.map((msg: any) => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
              msg.role === "user"
                ? "bg-white/10 text-white self-start"
                : "bg-indigo-600 text-white self-end"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/leads", label: "Leads", icon: "🎯" },
    { href: "/dashboard/chats", label: "Chats", icon: "💬" },
    { href: "/dashboard/broadcast", label: "Broadcast", icon: "📢" },
    { href: "/dashboard/products", label: "Products", icon: "📦" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#020817] flex">
      <div className="w-60 border-r border-white/10 p-6 flex flex-col gap-8 shrink-0">
        <h1 className="text-lg font-black text-white uppercase tracking-tight">
          CHIYA<span className="text-indigo-400">TECH</span>
        </h1>

        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 text-sm font-bold px-3 py-2.5 rounded-xl transition-all no-underline ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="mt-auto text-xs font-black text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors text-left"
        >
          Logout →
        </button>
      </div>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
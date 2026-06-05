"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

const steps = ["Shop Details", "Shop Type", "WhatsApp", "Done"];

const SHOP_TYPES = [
  { value: "JEWELLERY", label: "💍 Jewellery" },
  { value: "SALON", label: "✂️ Salon" },
  { value: "GYM", label: "💪 Gym" },
  { value: "CLOTHING", label: "👗 Clothing" },
  { value: "RESTAURANT", label: "🍽️ Restaurant" },
  { value: "CUSTOM", label: "✏️ Custom" },
];

const DEFAULT_FOLLOWUP: Record<string, { days: number; message: string }[]> = {
  JEWELLERY: [
    { days: 0, message: "Sir, rate poochi thi — aaj order karein?" },
    { days: 1, message: "Sir, special discount chal raha hai!" },
    { days: 3, message: "Sir, hum yahan hain — koi help chahiye?" },
  ],
  SALON: [
    { days: 15, message: "Sir, 15 din ho gaye — aa jaiye!" },
    { days: 30, message: "Sir, baal bade ho gaye hain 😄 Book karein?" },
    { days: 45, message: "Sir, special offer hai is hafte!" },
  ],
  GYM: [
    { days: 3, message: "Sir, 3 din se nahi aaye — sab theek?" },
    { days: 7, message: "Sir, workout miss mat karo — aaj aao!" },
    { days: 15, message: "Sir, special membership offer hai!" },
  ],
  CLOTHING: [
    { days: 0, message: "Sir, jo dekha tha — abhi available hai!" },
    { days: 2, message: "Sir, naya collection aa gaya!" },
    { days: 5, message: "Sir, sale chal rahi hai — aaj last day!" },
  ],
  RESTAURANT: [
    { days: 7, message: "Sir, wapas aiye — aaj special dish hai!" },
    { days: 15, message: "Sir, weekend special menu aa gaya!" },
    { days: 30, message: "Sir, miss kar rahe hain — special discount!" },
  ],
  CUSTOM: [
    { days: 1, message: "Sir, kya hum help kar sakte hain?" },
    { days: 3, message: "Sir, special offer hai aapke liye!" },
    { days: 7, message: "Sir, hum yahan hain — batayein!" },
  ],
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", slug: "", whatsapp: "", address: "",
    type: "JEWELLERY", customType: "",
  });

  const [followups, setFollowups] = useState(DEFAULT_FOLLOWUP["JEWELLERY"]);

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600";

  const handleSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleTypeChange = (type: string) => {
    setForm({ ...form, type });
    setFollowups(DEFAULT_FOLLOWUP[type] ?? DEFAULT_FOLLOWUP["CUSTOM"]);
  };

  const handleCreateShop = async () => {
    setLoading(true);
    setError("");
    try {
      const finalType = form.type === "CUSTOM" && form.customType
        ? form.customType.toUpperCase()
        : form.type;

      await API.post("/shops", {
        name: form.name,
        slug: form.slug,
        whatsapp: form.whatsapp,
        address: form.address,
        type: finalType,
        followupConfig: followups,
      });
      setStep(3);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            CHIYA<span className="text-indigo-400">TECH</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Setup your AI Sales Employee</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                i <= step ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-600"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-6 h-px ${i < step ? "bg-indigo-500" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

          {/* Step 0 — Shop Details */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Shop Details</p>
              <input
                placeholder="Shop Name (e.g. Raj Jewellers)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: handleSlug(e.target.value) })}
                className={inputClass}
              />
              <input
                placeholder="Address (optional)"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputClass}
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                onClick={() => {
                  if (!form.name.trim()) { setError("Shop name required"); return; }
                  setError(""); setStep(1);
                }}
                className="w-full bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-xl py-3 hover:bg-indigo-500 transition-colors"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 1 — Shop Type + Followup */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Shop Type</p>
              <p className="text-slate-500 text-xs mb-2">AI isi hisaab se followup karega</p>

              <div className="grid grid-cols-2 gap-2">
                {SHOP_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => handleTypeChange(t.value)}
                    className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      form.type === t.value
                        ? "bg-indigo-600 text-white border border-indigo-500"
                        : "bg-white/5 text-slate-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {form.type === "CUSTOM" && (
                <input
                  placeholder="Apni shop type likho (e.g. Dental)"
                  value={form.customType}
                  onChange={(e) => setForm({ ...form, customType: e.target.value })}
                  className={inputClass}
                />
              )}

              {/* Followup preview */}
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                  Followup Schedule
                </p>
                {followups.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[9px] text-indigo-400 font-black w-14 shrink-0">
                      {f.days === 0 ? "1 ghanta" : `${f.days} din`}
                    </span>
                    <p className="text-slate-400 text-[10px]">{f.message}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 bg-white/5 text-slate-400 font-black text-sm uppercase tracking-widest rounded-xl py-3 hover:bg-white/10 transition-colors">
                  ← Back
                </button>
                <button onClick={() => setStep(2)} className="flex-1 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-xl py-3 hover:bg-indigo-500 transition-colors">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — WhatsApp */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-black text-white uppercase tracking-widest mb-2">WhatsApp Number</p>
              <p className="text-slate-500 text-xs">Apna WhatsApp number dalo — jaise 9876543210</p>
              <input
                placeholder="WhatsApp number"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className={inputClass}
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 bg-white/5 text-slate-400 font-black text-sm uppercase tracking-widest rounded-xl py-3 hover:bg-white/10 transition-colors">
                  ← Back
                </button>
                <button
                  onClick={handleCreateShop}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-xl py-3 hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Shop"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Done */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-3xl">
                🎉
              </div>
              <div>
                <p className="text-white font-black text-lg uppercase tracking-tight mb-2">Shop Ready!</p>
                <p className="text-slate-500 text-sm">
                  Tera AI Sales Employee taiyaar hai. Ab products add karo!
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-xl py-3 hover:bg-indigo-500 transition-colors"
              >
                Dashboard Pe Jao →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
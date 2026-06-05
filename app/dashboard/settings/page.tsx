"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";

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

export default function SettingsPage() {
  const [shopId, setShopId] = useState("");
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    address: "",
    type: "JEWELLERY",
    customType: "",
  });
  const [followups, setFollowups] = useState(DEFAULT_FOLLOWUP["JEWELLERY"]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    API.get("/shops").then((res) => {
      const shop = res.data[0];
      if (shop) {
        setShopId(shop.id);
        setForm({
          name: shop.name ?? "",
          whatsapp: shop.whatsapp ?? "",
          address: shop.address ?? "",
          type: shop.type ?? "JEWELLERY",
          customType: "",
        });
        setFollowups(
          shop.followupConfig ??
          DEFAULT_FOLLOWUP[shop.type] ??
          DEFAULT_FOLLOWUP["CUSTOM"]
        );
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleTypeChange = (type: string) => {
    setForm({ ...form, type });
    setFollowups(DEFAULT_FOLLOWUP[type] ?? DEFAULT_FOLLOWUP["CUSTOM"]);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const finalType =
        form.type === "CUSTOM" && form.customType
          ? form.customType.toUpperCase()
          : form.type;

      await API.patch(`/shops/${shopId}`, {
        name: form.name,
        whatsapp: form.whatsapp,
        address: form.address,
        type: finalType,
        followupConfig: followups,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600";

  if (loading) return <p className="text-slate-600 text-sm">Loading...</p>;

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Settings</h2>
        <p className="text-slate-600 text-sm">Shop details aur AI followup configure karo</p>
      </div>

      <div className="flex flex-col gap-6">

        {/* Shop Name */}
        <div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Shop Name</p>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Shop ka naam"
            className={inputClass}
          />
        </div>

        {/* WhatsApp */}
        <div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">WhatsApp Number</p>
          <p className="text-slate-600 text-xs mb-2">Sirf number dalo — jaise 9876543210</p>
          <input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="WhatsApp number"
            className={inputClass}
          />
        </div>

        {/* Address */}
        <div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Address</p>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Shop ka address (optional)"
            className={inputClass}
          />
        </div>

        {/* Shop Type */}
        <div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Shop Type</p>
          <p className="text-slate-600 text-xs mb-3">AI isi hisaab se followup karega</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
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
              value={form.customType}
              onChange={(e) => setForm({ ...form, customType: e.target.value })}
              placeholder="Apni shop type likho (e.g. Dental, Pharmacy)"
              className={inputClass}
            />
          )}
        </div>

        {/* Followup Schedule */}
        <div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
            AI Followup Schedule
          </p>
          <div className="flex flex-col gap-3">
            {followups.map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest w-16 shrink-0">
                    Followup {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={f.days}
                      onChange={(e) => {
                        const updated = [...followups];
                        updated[i] = { ...updated[i], days: parseInt(e.target.value) || 0 };
                        setFollowups(updated);
                      }}
                      className="w-16 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs outline-none focus:border-indigo-500 text-center"
                    />
                    <span className="text-slate-600 text-xs">din baad</span>
                  </div>
                </div>
                <textarea
                  value={f.message}
                  rows={2}
                  onChange={(e) => {
                    const updated = [...followups];
                    updated[i] = { ...updated[i], message: e.target.value };
                    setFollowups(updated);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : success ? "✅ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
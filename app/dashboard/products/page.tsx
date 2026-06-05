"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [shopId, setShopId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [catName, setCatName] = useState("");
  const [filterCat, setFilterCat] = useState("ALL");
  const [form, setForm] = useState({
    name: "", price: "", stock: "", description: "", categoryId: "",
  });

  useEffect(() => {
    API.get("/shops").then((res) => {
      const shop = res.data[0];
      if (shop) {
        setShopId(shop.id);
        fetchProducts(shop.id);
        fetchCategories(shop.id);
      }
    });
  }, []);

  const fetchProducts = (id: string) => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  const fetchCategories = (id: string) => {
    API.get(`/categories/${id}`).then((res) => setCategories(res.data));
  };

  const handleAddCategory = async () => {
    if (!catName.trim()) return;
    try {
      await API.post("/categories", { shopId, name: catName });
      setCatName("");
      fetchCategories(shopId);
    } catch {
      alert("Failed to add category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete karna hai?")) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories(shopId);
      if (filterCat === id) setFilterCat("ALL");
    } catch {
      alert("Failed to delete category");
    }
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.price || !form.stock || !form.categoryId) {
      alert("Sab fields fill karo");
      return;
    }
    try {
      await API.post("/products", {
        shopId,
        name: form.name,
        price: parseInt(form.price),
        stock: parseInt(form.stock),
        description: form.description,
        categoryId: form.categoryId,
        images: [],
      });
      setForm({ name: "", price: "", stock: "", description: "", categoryId: "" });
      setShowProductForm(false);
      fetchProducts(shopId);
    } catch {
      alert("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete karna hai?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts(shopId);
    } catch {
      alert("Failed to delete");
    }
  };

  const filteredProducts = filterCat === "ALL"
    ? products
    : products.filter((p) => p.categoryId === filterCat);

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600";

  return (
    <div>

      {/* ── Categories Section ── */}
      <div className="mb-10">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
          Categories
        </h3>

        {/* Add Category */}
        <div className="flex gap-3 mb-4">
          <input
            placeholder="New category (e.g. Earrings)"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
          />
          <button
            onClick={handleAddCategory}
            className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-colors"
          >
            + Add
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5"
            >
              <span className="text-xs font-bold text-slate-300">{cat.name}</span>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-slate-600 hover:text-red-400 transition-colors text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-slate-700 text-xs">Koi category nahi — add karo!</p>
          )}
        </div>
      </div>

      {/* ── Products Section ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Products
            <span className="text-slate-600 text-sm font-medium normal-case tracking-normal ml-2">
              {filteredProducts.length} items
            </span>
          </h2>
          <button
            onClick={() => setShowProductForm(!showProductForm)}
            className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-colors"
          >
            {showProductForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterCat("ALL")}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              filterCat === "ALL"
                ? "bg-indigo-600 text-white"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                filterCat === cat.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {cat.name} ({products.filter((p) => p.categoryId === cat.id).length})
            </button>
          ))}
        </div>

        {/* Add Product Form */}
        {showProductForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 flex flex-col gap-4">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">New Product</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className={`${inputClass} bg-[#0a0f1e]`}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                placeholder="Price (₹)"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} md:col-span-2`}
              />
            </div>
            <button
              onClick={handleAddProduct}
              className="w-full py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-colors"
            >
              Add Product
            </button>
          </div>
        )}

        {/* Products List */}
        {loading ? (
          <p className="text-slate-600 text-sm">Loading...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between hover:bg-white/8 transition-all"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-white font-bold text-sm">{product.name}</p>
                  <p className="text-slate-500 text-xs">{product.description ?? "—"}</p>
                  <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full w-fit uppercase tracking-widest">
                    {product.category?.name ?? "—"}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-indigo-400 font-black text-sm">₹{product.price}</p>
                  <p className="text-slate-600 text-xs">Stock: {product.stock}</p>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-[10px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-slate-600 text-sm">Koi product nahi.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
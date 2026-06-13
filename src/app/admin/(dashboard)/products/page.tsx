"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Check,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUploadImage,
} from "@/lib/hooks";
import type { Product } from "@/types";

// ─── Product Form Modal (Dark Themed) ───────────────────────────────────────
function ProductFormModal({
  product,
  onClose,
}: {
  product: Partial<Product> | null;
  onClose: () => void;
}) {
  const isEdit = !!product?.id;
  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();
  const uploadMut = useUploadImage();

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || "",
    category: product?.category || "",
    stock: product?.stock || 0,
    sizes: product?.sizes?.join(", ") || "XS, S, M, L, XL",
    colors: product?.colors?.join(", ") || "Ivory, Obsidian, Blush",
    tags: product?.tags?.join(", ") || "",
    isNew: product?.isNew ?? false,
    isTrending: product?.isTrending ?? false,
    isFeatured: product?.isFeatured ?? false,
    images: product?.images || ([] as string[]),
  });

  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadMut.mutateAsync({ file, folder: "zaforia/products" });
      setForm((f) => ({ ...f, images: [...f.images, result.url] }));
    } catch {
      alert("Cloudinary Upload failed — Make sure env variables are set up!");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) uploadFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: Number(form.stock),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      slug: form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      isActive: true,
    };
    if (isEdit && product?.id) {
      await updateMut.mutateAsync({ id: product.id, product: payload });
    } else {
      await createMut.mutateAsync(payload);
    }
    onClose();
  };

  const isPending = createMut.isPending || updateMut.isPending;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-[550px] bg-[#FFFFFF] border-l border-[#E5E2DE] shadow-2xl z-50 overflow-y-auto p-6 text-[#1A1A1A] font-jost"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E2DE]">
          <h2 className="font-cormorant text-3xl italic text-[#1A1A1A]">
            {isEdit ? "Modify Piece" : "Scaffold New Piece"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F0EB] transition-colors rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cloudinary Drag-Drop Image Uploader */}
          <div>
            <label className="text-lg uppercase tracking-widest text-espresso font-medium mb-2 block">
              Editorial Media Assets (Cloudinary)
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              className={`relative border border-dashed rounded-xl py-6 text-center transition-all mb-3 ${
                dragOver ? "border-[#D4B88A] bg-[#F5F0EB]" : "border-[#E5E2DE] hover:border-[#C8C4BC]/40"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <div className="w-5 h-5 border-2 border-[#D4B88A] border-t-transparent rounded-full animate-spin" />
                  <p className="text-lg text-espresso">Pushing media to Cloudinary CDN...</p>
                </div>
              ) : (
                <>
                  <Upload size={20} className="mx-auto text-espresso mb-2" />
                  <p className="text-lg text-espresso">Drag and drop photos or</p>
                  <label className="cursor-pointer text-lg font-medium text-[#D4B88A] hover:underline mt-1 inline-block">
                    Browse assets
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                  </label>
                </>
              )}
            </div>

            {/* Asset Previews */}
            {form.images.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {form.images.map((url, i) => (
                  <div key={i} className="relative w-16 h-20 border border-[#E5E2DE] overflow-hidden group rounded-lg">
                    <Image src={url} alt={`Asset preview ${i + 1}`} fill className="object-cover" sizes="64px" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                      className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center transition-all"
                    >
                      <X size={20} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Name & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-lg uppercase tracking-widest text-espresso font-medium mb-1 block">
                Piece Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                placeholder="e.g. Silk Drape Gown"
              />
            </div>
            <div>
              <label className="text-lg uppercase tracking-widest text-espresso font-medium mb-1 block">
                Category
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
              >
                <option value="">Select Category</option>
                {[
                  "Dresses",
                  "Ethnic Wear",
                  "Western Wear",
                  "Tops",
                  "Skirts",
                  "Blazers",
                  "Accessories",
                  "Footwear",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Original Compare Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-lg uppercase tracking-widest text-espresso font-medium mb-1 block">
                Price (INR)
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
              />
            </div>
            <div>
              <label className="text-lg uppercase tracking-widest text-espresso font-medium mb-1 block">
                Compare At (Original)
              </label>
              <input
                type="number"
                min="0"
                value={form.originalPrice}
                onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                placeholder="For discount display"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="text-lg uppercase tracking-widest text-espresso font-medium mb-1 block">
              Total Stock
            </label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
              className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-lg uppercase tracking-widest text-espresso font-medium mb-1 block">
              Editorial Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A] resize-none"
              placeholder="Tell the story of this piece..."
            />
          </div>

          {/* Dynamic properties lists */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-lg uppercase tracking-widest text-espresso font-medium mb-1 block">
                Sizes
              </label>
              <input
                value={form.sizes}
                onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
                className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                placeholder="XS, S, M, L"
              />
            </div>
            <div>
              <label className="text-lg uppercase tracking-widest text-espresso font-medium mb-1 block">
                Colors
              </label>
              <input
                value={form.colors}
                onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
                className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                placeholder="Gold, Ivory"
              />
            </div>
            <div>
              <label className="text-lg uppercase tracking-widest text-espresso font-medium mb-1 block">
                Tags
              </label>
              <input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                placeholder="luxury, silk"
              />
            </div>
          </div>

          {/* Collection Status Flags */}
          <div className="flex gap-6 pt-1 select-none">
            {[
              { key: "isNew", label: "New Arrival" },
              { key: "isTrending", label: "Bestseller" },
              { key: "isFeatured", label: "Featured" },
            ].map((flag) => (
              <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() =>
                    setForm((f) => ({ ...f, [flag.key]: !(f as any)[flag.key] }))
                  }
                  className={`w-4 h-4 border flex items-center justify-center rounded transition-all ${
                    (form as any)[flag.key] ? "bg-[#D4B88A] border-[#D4B88A]" : "border-[#E5E2DE] bg-[#F5F0EB]"
                  }`}
                >
                  {(form as any)[flag.key] && <Check size={18} className="text-[#FFFFFF] stroke-[3px]" />}
                </div>
                <span className="text-lg text-espresso">{flag.label}</span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#E5E2DE]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#E5E2DE] bg-transparent hover:bg-[#F5F0EB] text-lg uppercase tracking-widest transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-lg bg-[#D4B88A] text-[#FFFFFF] hover:bg-[#B8847E] text-lg uppercase tracking-widest font-semibold transition-colors disabled: flex items-center justify-center gap-2"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check size={20} className="stroke-[3px]" />
              )}
              {isEdit ? "Commit Piece" : "Scaffold Piece"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function AdminProducts() {
  const { data: rawProducts, isLoading } = useProducts({ size: 100 });
  const deleteMut = useDeleteProduct();
  const products: Product[] = (rawProducts as any)?.content || [];

  const [editing, setEditing] = useState<Partial<Product> | null | false>(false);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-[#1A1A1A]">
      {/* Search and Scaffold Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#FFFFFF] border border-[#E5E2DE] p-4 rounded-2xl">
        <input
          type="text"
          placeholder="Filter pieces by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 bg-[#F5F0EB] border border-[#E5E2DE] rounded-xl px-4 py-2.5 text-lg uppercase tracking-widest font-light text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
        />
        <button
          onClick={() => setEditing({})}
          className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-[#D4B88A] text-[#FFFFFF] font-semibold text-lg uppercase tracking-widest hover:bg-[#B8847E] transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add Piece
        </button>
      </div>

      {/* Main Pieces Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E5E2DE] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E5E2DE] bg-[#FAFAF7]">
                  <th className="text-left px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    Piece Details
                  </th>
                  <th className="text-left px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    Price
                  </th>
                  <th className="text-left px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    Inventory
                  </th>
                  <th className="text-left px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    State Badges
                  </th>
                  <th className="text-right px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    Control Panel
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-espresso text-lg">
                      No matching pieces found in catalog.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-[#E5E2DE] last:border-0 hover:bg-[#F5F0EB] transition-colors"
                    >
                      {/* Name & ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-13 bg-[#F5F0EB] overflow-hidden rounded relative flex-shrink-0">
                            {p.images?.[0] && (
                              <Image
                                src={p.images[0]}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-lg font-medium text-[#1A1A1A] line-clamp-1">{p.name}</p>
                            <p className="text-lg text-espresso uppercase tracking-wider font-light mt-0.5">
                              {p.id?.slice(0, 10)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-lg text-espresso tracking-wider uppercase font-light">
                        {p.category}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-lg font-semibold text-[#1A1A1A] font-variant-numeric: tabular-nums">
                        ₹{p.price.toLocaleString()}
                      </td>

                      {/* Stock level */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              p.stock <= 5
                                ? "bg-[#C47A7A] animate-pulse"
                                : p.stock <= 15
                                ? "bg-[#D4B896]"
                                : "bg-[#7DAF8E]"
                            }`}
                          />
                          <span className="text-lg text-espresso font-medium font-variant-numeric: tabular-nums">
                            {p.stock} units
                          </span>
                        </div>
                      </td>

                      {/* Flags */}
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {p.isNew && (
                            <span className="px-2 py-0.5 rounded text-lg tracking-widest bg-[#EDE8E0]/10 text-[#EDE8E0] uppercase font-semibold border border-[#EDE8E0]/15">
                              New
                            </span>
                          )}
                          {p.isTrending && (
                            <span className="px-2 py-0.5 rounded text-lg tracking-widest bg-[#D4B88A]/10 text-[#D4B88A] uppercase font-semibold border border-[#D4B88A]/15">
                              Hot
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="px-2 py-0.5 rounded text-lg tracking-widest bg-[#E8D5B0]/10 text-[#E8D5B0] uppercase font-semibold border border-[#E8D5B0]/15">
                              Feature
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditing(p)}
                            className="w-7 h-7 flex items-center justify-center bg-[#F5F0EB] hover:bg-[#D4B88A] hover:text-[#FFFFFF] text-espresso transition-all rounded"
                            title="Edit Piece"
                          >
                            <Pencil size={20} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Purge "${p.name}" from catalog?`)) deleteMut.mutate(p.id);
                            }}
                            className="w-7 h-7 flex items-center justify-center bg-[#F5F0EB] hover:bg-[#C47A7A]/20 hover:text-[#C47A7A] text-espresso transition-all rounded"
                            title="Delete Piece"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editing Dialog drawer overlay */}
      <AnimatePresence>
        {editing !== false && (
          <ProductFormModal product={editing} onClose={() => setEditing(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

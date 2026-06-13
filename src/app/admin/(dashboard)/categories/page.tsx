"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search, UploadCloud, X, Loader2 } from "lucide-react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useUploadImage } from "@/lib/hooks";
import type { Category } from "@/types";

export default function AdminCategories() {
  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const uploadMutation = useUploadImage();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const filteredCategories = categories.filter((c: Category) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (cat: Category | null = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        slug: cat.slug || "",
        description: cat.description || "",
        image: cat.image || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", slug: "", description: "", image: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadMutation.mutateAsync({ file, folder: "zaaforia/categories" });
      setFormData({ ...formData, image: res.url });
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image. Please check your Cloudinary configuration.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({ id: editingCategory.id, category: formData });
      } else {
        await createMutation.mutateAsync(formData as any);
      }
      handleCloseModal();
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        alert(err.message || "An error occurred");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E5E2DE] rounded-lg text-sm font-jost focus:outline-none focus:border-[#D4B88A] transition-colors shadow-sm"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white rounded-lg text-sm uppercase tracking-widest font-semibold hover:bg-[#2C2C2C] transition-colors flex-shrink-0 shadow-sm"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#FFFFFF] border border-[#E5E2DE] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F0EB] text-[#1A1A1A] text-[11px] uppercase tracking-widest font-semibold font-jost border-b border-[#E5E2DE]">
                <th className="p-4 pl-6">Category</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-center">Products</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2DE]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#D4B88A] mx-auto" />
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#9A9A9A] font-jost">
                    No categories found. Click "Add Category" to create one.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat: Category) => (
                  <tr key={cat.id} className="hover:bg-[#FAFAF7] transition-colors group">
                    <td className="p-4 pl-6 flex items-center gap-4">
                      <div className="w-12 h-12 relative rounded bg-[#F5F0EB] overflow-hidden flex-shrink-0 border border-[#E5E2DE]">
                        {cat.image ? (
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#9A9A9A] uppercase tracking-wider">No Img</div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A1A] text-sm">{cat.name}</p>
                        {cat.description && <p className="text-[11px] text-[#6B6B6B] mt-0.5 max-w-xs truncate">{cat.description}</p>}
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-[#6B6B6B] font-jost">{cat.slug}</td>
                    <td className="p-4 text-center text-[13px] font-semibold text-[#1A1A1A]">
                      {cat.productCount || 0}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="p-1.5 text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F0EB] rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-[#C4607A] hover:bg-[#C4607A]/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-jost">
          <div className="bg-[#FFFFFF] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#E5E2DE] flex justify-between items-center bg-[#FAFAF7]">
              <h3 className="font-cormorant text-2xl font-bold text-[#1A1A1A]">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>
              <button onClick={handleCloseModal} className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#1A1A1A] font-semibold mb-2">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAFAF7] border border-[#E5E2DE] rounded-lg text-sm focus:outline-none focus:border-[#D4B88A] transition-colors"
                    placeholder="e.g., Summer Collection"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#1A1A1A] font-semibold mb-2">Slug (Optional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAFAF7] border border-[#E5E2DE] rounded-lg text-sm focus:outline-none focus:border-[#D4B88A] transition-colors"
                    placeholder="Auto-generated if left blank"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#1A1A1A] font-semibold mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAFAF7] border border-[#E5E2DE] rounded-lg text-sm focus:outline-none focus:border-[#D4B88A] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#1A1A1A] font-semibold mb-2">Thumbnail Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 relative border border-[#E5E2DE] rounded-lg bg-[#FAFAF7] overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {formData.image ? (
                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                      ) : (
                        <span className="text-[10px] text-[#9A9A9A] uppercase tracking-wider">No Image</span>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin text-[#D4B88A]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-[#D4B88A] text-[#D4B88A] hover:bg-[#D4B88A] hover:text-white rounded-lg text-sm uppercase tracking-widest font-semibold cursor-pointer transition-colors">
                        <UploadCloud size={16} /> Upload Image
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                      </label>
                      <p className="text-[10px] text-[#6B6B6B] mt-2 tracking-wide">Suggested size: 480x640px (3:4 ratio)</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-[#E5E2DE] bg-[#FAFAF7] flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-white border border-[#E5E2DE] text-[#1A1A1A] rounded-lg text-sm uppercase tracking-widest font-semibold hover:bg-[#F5F0EB] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="category-form"
                disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-lg text-sm uppercase tracking-widest font-semibold hover:bg-[#2C2C2C] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
                {editingCategory ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

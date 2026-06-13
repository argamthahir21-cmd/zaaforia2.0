"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  X,
  Edit2,
  RefreshCw,
  ArrowLeft,
  Upload,
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

interface ContentItem {
  _id: string;
  key: string;
  value: string;
  type: string;
  fieldType: string;
  page: string;
  section: string;
  label?: string;
  order: number;
}

const PAGE_TITLES: Record<string, string> = {
  home: "Home Page",
  global: "Global Elements",
};

const FIELD_TYPE_ICONS: Record<string, any> = {
  heading: Type,
  subheading: Type,
  body: Type,
  cta_text: Type,
  cta_link: LinkIcon,
  image: ImageIcon,
  label: Type,
  icon: Type,
};

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const pageSlug = params.pageSlug as string;

  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ key: "", value: "", label: "", section: "", fieldType: "body", type: "text" });
  const [successKey, setSuccessKey] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content?page=${pageSlug}`);
      if (res.ok) {
        const data = await res.json();
        setContents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pageSlug]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Group by section
  const sections = contents.reduce((acc: Record<string, ContentItem[]>, item) => {
    const sec = item.section || "General";
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(item);
    return acc;
  }, {});

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const handleEdit = (item: ContentItem) => {
    setEditingKey(item.key);
    setEditingValue(item.value);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingValue("");
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: editingValue }),
      });
      if (res.ok) {
        setContents(contents.map((item) => (item.key === key ? { ...item, value: editingValue } : item)));
        setEditingKey(null);
        setEditingValue("");
        setSuccessKey(key);
        setTimeout(() => setSuccessKey(null), 2000);
      } else {
        alert("Failed to save content");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving content");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Delete this content entry? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/content?key=${encodeURIComponent(key)}`, { method: "DELETE" });
      if (res.ok) {
        setContents(contents.filter((c) => c.key !== key));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.key || !newEntry.value) return;
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEntry,
          page: pageSlug,
          order: contents.length + 1,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setContents([...contents, created]);
        setNewEntry({ key: "", value: "", label: "", section: "", fieldType: "body", type: "text" });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploading(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "zaforia/content");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();

      const saveRes = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: url }),
      });
      if (saveRes.ok) {
        setContents(contents.map((c) => (c.key === key ? { ...c, value: url } : c)));
        setSuccessKey(key);
        setTimeout(() => setSuccessKey(null), 2000);
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed — check Cloudinary credentials");
    } finally {
      setUploading(null);
    }
  };

  const renderFieldEditor = (item: ContentItem) => {
    const isEditing = editingKey === item.key;
    const isImage = item.type === "image" || item.fieldType === "image";
    const isSuccess = successKey === item.key;

    return (
      <motion.div
        key={item.key}
        layout
        className={`bg-[#F5F0EB] border rounded-xl p-4 transition-all ${
          isSuccess ? "border-[#7DAF8E]/50" : isEditing ? "border-[#D4B88A]/40" : "border-[#E5E2DE] hover:border-[#E5E2DE]/80"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Field Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {(() => {
                const Icon = FIELD_TYPE_ICONS[item.fieldType] || Type;
                return <Icon size={20} className="text-espresso flex-shrink-0" />;
              })()}
              <span className="text-lg uppercase tracking-[0.2em] text-espresso font-semibold">
                {item.label || item.key}
              </span>
              {isSuccess && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg uppercase tracking-[0.2em] text-[#7DAF8E] font-semibold flex items-center gap-1"
                >
                  <Check size={18} /> Saved
                </motion.span>
              )}
            </div>

            {/* Value Display or Editor */}
            {isImage ? (
              <div className="space-y-3">
                {/* Image Preview */}
                {item.value && (
                  <div className="relative w-full max-w-[300px] aspect-[16/10] bg-[#F5F0EB] rounded-lg overflow-hidden">
                    <Image src={item.value} alt={item.label || "Image"} fill className="object-cover" sizes="300px" />
                  </div>
                )}
                {/* Upload / URL controls */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F0EB] hover:bg-[#3E3E3E] rounded-lg text-lg uppercase tracking-[0.2em] text-espresso font-semibold transition-colors">
                    {uploading === item.key ? (
                      <div className="w-3 h-3 border-2 border-[#D4B88A] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={11} />
                    )}
                    Upload New
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(item.key, f);
                      }}
                    />
                  </label>
                  {isEditing ? (
                    <input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      placeholder="Or paste image URL..."
                      className="flex-1 bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-1.5 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                    />
                  ) : (
                    <p className="text-lg text-espresso truncate flex-1 font-light">{item.value?.slice(0, 60)}...</p>
                  )}
                </div>
              </div>
            ) : isEditing ? (
              item.fieldType === "body" || item.value.length > 80 ? (
                <textarea
                  rows={3}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A] resize-none font-light"
                />
              ) : (
                <input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A] font-light"
                />
              )
            ) : (
              <p className={`text-lg text-[#1A1A1A] font-light leading-relaxed whitespace-pre-wrap ${
                item.fieldType === "heading" ? "font-cormorant text-xl italic" : 
                item.fieldType === "subheading" ? "font-cormorant text-lg italic" : ""
              }`}>
                {item.value}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0 pt-1">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSave(item.key)}
                  disabled={saving}
                  className="p-2 bg-[#7DAF8E]/10 hover:bg-[#7DAF8E]/20 text-[#7DAF8E] rounded-lg transition-colors"
                  title="Save"
                >
                  {saving ? (
                    <div className="w-3 h-3 border-2 border-[#7DAF8E] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-[#C47A7A]/10 hover:bg-[#C47A7A]/20 text-[#C47A7A] rounded-lg transition-colors"
                  title="Cancel"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-[#F5F0EB] hover:bg-[#3E3E3E] text-espresso rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(item.key)}
                  className="p-2 bg-[#F5F0EB] hover:bg-[#C47A7A]/20 hover:text-[#C47A7A] text-espresso rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 text-[#1A1A1A] font-jost">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#FFFFFF] border border-[#E5E2DE] p-5 rounded-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/pages")}
            className="p-2 hover:bg-[#F5F0EB] rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-espresso" />
          </button>
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]">
              {PAGE_TITLES[pageSlug] || pageSlug}
            </h3>
            <p className="text-lg text-espresso uppercase tracking-widest font-light mt-0.5">
              {Object.keys(sections).length} sections · {contents.length} editable fields
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#D4B88A] text-[#FFFFFF] rounded-lg text-lg uppercase tracking-[0.2em] font-semibold hover:bg-[#B8847E] transition-colors flex items-center gap-1.5"
          >
            <Plus size={20} /> Add Field
          </button>
          <button
            onClick={fetchContent}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F0EB] text-espresso rounded-lg transition-colors"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <a
            href={pageSlug === "global" ? "/" : `/${pageSlug === "home" ? "" : pageSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F0EB] text-espresso rounded-lg transition-colors"
            title="Preview Page"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Add Entry Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#FFFFFF] border border-[#D4B88A]/30 p-5 rounded-2xl space-y-4 overflow-hidden"
          >
            <h4 className="text-lg uppercase tracking-[0.2em] text-[#D4B88A] font-semibold">
              Create New Content Field
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <input
                value={newEntry.key}
                onChange={(e) => setNewEntry({ ...newEntry, key: e.target.value })}
                placeholder="Unique key (e.g. home.hero.title)"
                className="bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
              />
              <input
                value={newEntry.label}
                onChange={(e) => setNewEntry({ ...newEntry, label: e.target.value })}
                placeholder="Display Label"
                className="bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
              />
              <input
                value={newEntry.section}
                onChange={(e) => setNewEntry({ ...newEntry, section: e.target.value })}
                placeholder="Section Name"
                className="bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
              />
            </div>
            <textarea
              rows={2}
              value={newEntry.value}
              onChange={(e) => setNewEntry({ ...newEntry, value: e.target.value })}
              placeholder="Content value..."
              className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A] resize-none"
            />
            <div className="flex items-center gap-3">
              <select
                value={newEntry.fieldType}
                onChange={(e) => setNewEntry({ ...newEntry, fieldType: e.target.value })}
                className="bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
              >
                <option value="heading">Heading</option>
                <option value="subheading">Subheading</option>
                <option value="body">Body Text</option>
                <option value="cta_text">CTA Text</option>
                <option value="cta_link">CTA Link</option>
                <option value="image">Image</option>
                <option value="label">Label</option>
              </select>
              <select
                value={newEntry.type}
                onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
                className="bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
              >
                <option value="text">Text</option>
                <option value="url">URL</option>
                <option value="image">Image</option>
                <option value="richtext">Rich Text</option>
              </select>
              <button
                onClick={handleAddEntry}
                className="px-5 py-2 bg-[#D4B88A] text-[#FFFFFF] rounded-lg text-lg uppercase tracking-[0.2em] font-semibold hover:bg-[#B8847E] transition-colors flex items-center gap-1.5"
              >
                <Check size={20} /> Create
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-[#F5F0EB] text-espresso rounded-lg text-lg uppercase tracking-[0.2em] font-semibold hover:bg-[#3E3E3E] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Sections */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      ) : Object.keys(sections).length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E5E2DE] p-12 rounded-2xl text-center">
          <Type className="mx-auto mb-3 text-espresso" size={36} />
          <p className="text-lg text-espresso font-medium">No content entries for this page yet.</p>
          <p className="text-lg text-espresso mt-1 uppercase tracking-[0.2em]">
            Click &quot;Add Field&quot; above to create content entries, or visit the storefront to auto-seed.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(sections).map(([sectionName, items]) => (
            <div key={sectionName} className="bg-[#FFFFFF] border border-[#E5E2DE] rounded-2xl overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sectionName)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#FAFAF7] transition-colors border-b border-[#E5E2DE]"
              >
                <div className="flex items-center gap-3">
                  {collapsedSections.has(sectionName) ? (
                    <ChevronRight size={18} className="text-espresso" />
                  ) : (
                    <ChevronDown size={18} className="text-[#D4B88A]" />
                  )}
                  <h4 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#D4B88A]">
                    {sectionName}
                  </h4>
                </div>
                <span className="text-lg uppercase tracking-[0.2em] text-espresso font-semibold">
                  {items.length} fields
                </span>
              </button>

              {/* Section Fields */}
              <AnimatePresence>
                {!collapsedSections.has(sectionName) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-3">
                      {items.sort((a, b) => a.order - b.order).map(renderFieldEditor)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

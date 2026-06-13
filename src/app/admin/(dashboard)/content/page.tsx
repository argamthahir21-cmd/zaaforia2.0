"use client";

import { useEffect, useState } from "react";
import { Edit2, Save, X, RefreshCw, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminContent() {
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        setContentItems(data);
        
        // Auto-expand all sections by default initially
        const sectionsObj = data.reduce((acc: any, item: any) => {
          const s = item.section || "general";
          acc[s] = true;
          return acc;
        }, {});
        setExpandedSections(sectionsObj);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleEdit = (item: any) => {
    setEditingKey(item.key);
    setEditingValue(item.value);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingValue("");
  };

  const handleSave = async (key: string) => {
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: editingValue }),
      });
      if (res.ok) {
        setContentItems(
          contentItems.map((item) => (item.key === key ? { ...item, value: editingValue } : item))
        );
        setEditingKey(null);
        setEditingValue("");
      } else {
        alert("Failed to save content");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving content");
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Group items by section
  const sections = contentItems.reduce((acc: any, item: any) => {
    const sectionName = item.section || "general";
    if (!acc[sectionName]) acc[sectionName] = [];
    acc[sectionName].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8 text-[#2D2D2D] font-inter">
      <div className="flex justify-between items-center bg-[#FFFFFF] border border-[#E5E2DE] shadow-sm p-8 rounded-2xl">
        <div>
          <h3 className="text-[20px] font-semibold text-[#2D2D2D]">
            Content Management System
          </h3>
          <p className="text-sm text-[#666666] mt-2">
            Manage your storefront text, announcements, and footer copy in real-time.
          </p>
        </div>
        <button
          onClick={fetchContent}
          className="flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] border border-[#E5E2DE] hover:bg-[#F0EBE1] hover:border-[#D0CBC4] text-[#2D2D2D] rounded-lg transition-all shadow-sm text-sm font-medium"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-[#D4B06A]" : "text-[#999999]"} />
          Reload Data
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="skeleton h-32 w-full rounded-2xl bg-[#E5E2DE]/30" />
          <div className="skeleton h-32 w-full rounded-2xl bg-[#E5E2DE]/30" />
        </div>
      ) : contentItems.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E5E2DE] shadow-sm p-12 rounded-2xl text-center">
          <div className="w-16 h-16 bg-[#FAF8F5] border border-[#E5E2DE] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="text-[#999999]" size={32} />
          </div>
          <p className="text-lg font-semibold text-[#2D2D2D]">No content blocks found</p>
          <p className="text-sm text-[#666666] mt-2">
            Storefront sections haven't seeded their text blocks yet. Please visit the shop layout first.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(sections).map((secName) => {
            const isExpanded = expandedSections[secName];
            return (
              <div key={secName} className="bg-[#FFFFFF] border border-[#E5E2DE] rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                {/* Section Header (Collapsible) */}
                <button 
                  onClick={() => toggleSection(secName)}
                  className="w-full flex items-center justify-between p-6 bg-[#FFFFFF] hover:bg-[#FAF8F5] transition-colors border-b border-[#E5E2DE]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-[#D4B06A] rounded-full" />
                    <h4 className="text-[16px] font-semibold text-[#2D2D2D] capitalize">
                      {secName.replace(/_/g, ' ')} Section
                    </h4>
                    <span className="bg-[#F5F5F5] text-[#666666] text-[11px] px-2 py-0.5 rounded-full font-medium">
                      {sections[secName].length} items
                    </span>
                  </div>
                  <div className="text-[#999999]">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Section Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-6 bg-[#FAFAFA]/50">
                        {sections[secName].map((item: any, index: number) => (
                          <div
                            key={item.key}
                            className={`flex flex-col xl:flex-row gap-6 p-5 bg-[#FFFFFF] border border-[#E5E2DE] rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-[#D4B06A]/30 transition-all ${index !== sections[secName].length - 1 ? '' : ''}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#999999] uppercase tracking-widest mb-2 flex items-center gap-2">
                                {item.label || item.key.replace(/_/g, ' ')}
                              </p>
                              
                              {editingKey === item.key ? (
                                <textarea
                                  rows={3}
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  className="w-full bg-[#FFFFFF] border-2 border-[#D4B06A] rounded-lg px-4 py-3 text-[14px] text-[#2D2D2D] focus:outline-none focus:ring-4 focus:ring-[#D4B06A]/10 resize-y shadow-inner transition-all"
                                  autoFocus
                                />
                              ) : (
                                <p className="text-[15px] text-[#2D2D2D] leading-relaxed whitespace-pre-wrap pl-1">
                                  {item.value}
                                </p>
                              )}
                            </div>

                            <div className="flex items-start xl:items-center justify-end">
                              {editingKey === item.key ? (
                                <div className="flex gap-2 w-full xl:w-auto">
                                  <button
                                    onClick={() => handleSave(item.key)}
                                    className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#2D2D2D] hover:bg-[#404040] text-[#FFFFFF] rounded-lg text-sm font-medium transition-colors shadow-sm"
                                  >
                                    <Save size={16} />
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#FFFFFF] border border-[#E5E2DE] hover:bg-[#F5F5F5] text-[#666666] rounded-lg text-sm font-medium transition-colors"
                                  >
                                    <X size={16} />
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] border border-[#E5E2DE] hover:bg-[#F0EBE1] hover:border-[#D0CBC4] text-[#2D2D2D] rounded-lg text-sm font-medium transition-colors shadow-sm"
                                >
                                  <Edit2 size={16} className="text-[#999999]" />
                                  Edit Content
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

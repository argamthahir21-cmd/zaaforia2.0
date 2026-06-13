"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  X,
  FolderOpen,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

interface MediaItem {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  uploadedAt: Date;
}

export default function AdminMedia() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [folder, setFolder] = useState("zaforia/content");
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const newImage: MediaItem = {
        url: data.url,
        publicId: data.publicId,
        width: data.width,
        height: data.height,
        uploadedAt: new Date(),
      };
      setImages((prev) => [newImage, ...prev]);
    } catch (err) {
      alert("Upload failed — check your Cloudinary credentials in .env.local");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
      files.forEach(uploadFile);
    },
    [folder]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFile);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const removeImage = (publicId: string) => {
    if (!confirm("Remove this image from the gallery? Note: This only removes it from the local view.")) return;
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  const folders = [
    { label: "Content", value: "zaforia/content" },
    { label: "Products", value: "zaforia/products" },
    { label: "Banners", value: "zaforia/banners" },
    { label: "General", value: "zaforia/general" },
  ];

  return (
    <div className="space-y-6 text-[#1A1A1A] font-jost">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E5E2DE] p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]">
              Media Library
            </h3>
            <p className="text-lg text-espresso uppercase tracking-widest font-light mt-1">
              Upload and manage images via Cloudinary CDN — copy URLs for use anywhere on the site
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg uppercase tracking-[0.2em] text-espresso font-semibold">
              {images.length} assets
            </span>
          </div>
        </div>
      </div>

      {/* Folder Selector + Upload */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Folder Tabs */}
        <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E2DE] rounded-xl p-1.5">
          {folders.map((f) => (
            <button
              key={f.value}
              onClick={() => setFolder(f.value)}
              className={`px-4 py-2 rounded-lg text-lg uppercase tracking-[0.2em] font-semibold transition-all ${
                folder === f.value
                  ? "bg-[#D4B88A] text-[#FFFFFF]"
                  : "text-espresso hover:bg-[#F5F0EB] hover:text-[#1A1A1A]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`relative border-2 border-dashed rounded-2xl py-12 text-center transition-all ${
          dragOver
            ? "border-[#D4B88A] bg-[#D4B88A]/5"
            : "border-[#E5E2DE] hover:border-[#C8C4BC]/30 bg-[#FFFFFF]"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#D4B88A] border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-espresso uppercase tracking-widest">
              Pushing to Cloudinary CDN...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#D4B88A]/10 flex items-center justify-center">
              <Upload size={22} className="text-[#D4B88A]" />
            </div>
            <div>
              <p className="text-lg text-[#1A1A1A] font-medium">
                Drag and drop images here
              </p>
              <p className="text-lg text-espresso uppercase tracking-widest mt-1">
                or click below to browse files
              </p>
            </div>
            <label className="cursor-pointer px-6 py-2.5 bg-[#F5F0EB] hover:bg-[#3E3E3E] rounded-xl text-lg uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold transition-colors flex items-center gap-2">
              <FolderOpen size={20} />
              Browse Files
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.publicId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group relative bg-[#FFFFFF] border border-[#E5E2DE] rounded-xl overflow-hidden hover:border-[#D4B88A]/30 transition-all"
            >
              {/* Image */}
              <div
                className="relative aspect-square cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img.url}
                  alt={img.publicId}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyUrl(img.url);
                  }}
                  className="p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  {copied === img.url ? (
                    <Check size={20} className="text-[#7DAF8E]" />
                  ) : (
                    <Copy size={20} className="text-white" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.publicId);
                  }}
                  className="p-2 bg-white/10 backdrop-blur-sm hover:bg-[#C47A7A]/30 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 size={20} className="text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="bg-[#FFFFFF] border border-[#E5E2DE] p-16 rounded-2xl text-center">
          <ImageIcon className="mx-auto mb-3 text-espresso" size={40} />
          <p className="text-lg text-espresso font-medium">No images uploaded yet</p>
          <p className="text-lg text-espresso mt-1 uppercase tracking-[0.2em]">
            Drag and drop or browse to upload your first image
          </p>
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <>
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setSelectedImage(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="bg-[#FFFFFF] border border-[#E5E2DE] rounded-2xl p-6 max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg uppercase tracking-[0.2em] text-espresso font-semibold truncate max-w-sm">
                    {selectedImage.publicId}
                  </h4>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 hover:bg-[#F5F0EB] rounded-lg transition-colors"
                  >
                    <X size={20} className="text-espresso" />
                  </button>
                </div>

                <div className="relative w-full aspect-[16/10] bg-[#F5F0EB] rounded-xl overflow-hidden mb-4">
                  <Image
                    src={selectedImage.url}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="600px"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={selectedImage.url}
                    className="flex-1 bg-[#F5F0EB] border border-[#E5E2DE] rounded-lg px-3 py-2 text-lg text-espresso font-light"
                  />
                  <button
                    onClick={() => copyUrl(selectedImage.url)}
                    className="px-4 py-2 bg-[#D4B88A] text-[#FFFFFF] rounded-lg text-lg uppercase tracking-[0.2em] font-semibold hover:bg-[#B8847E] transition-colors flex items-center gap-1.5"
                  >
                    {copied === selectedImage.url ? <Check size={20} /> : <Copy size={20} />}
                    {copied === selectedImage.url ? "Copied!" : "Copy URL"}
                  </button>
                </div>

                {selectedImage.width && selectedImage.height && (
                  <p className="text-lg text-espresso uppercase tracking-[0.2em] mt-3">
                    Dimensions: {selectedImage.width} × {selectedImage.height}px
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

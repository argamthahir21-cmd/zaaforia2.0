"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Globe,
  FileText,
  ExternalLink,
} from "lucide-react";

const pages = [
  {
    slug: "home",
    title: "Home Page",
    description: "Hero section, promo banner, editorial cards, style stories, trust strip, intro screen",
    icon: Home,
    color: "#D4A5A0",
    sections: 7,
    previewUrl: "/",
  },
  {
    slug: "global",
    title: "Global Elements",
    description: "Announcement bar, footer tagline, and elements shared across all pages",
    icon: Globe,
    color: "#7DAF8E",
    sections: 2,
    previewUrl: "/",
  },
];

export default function AdminPages() {
  return (
    <div className="space-y-8 text-[#1A1A1A] font-jost">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E5E2DE] shadow-sm p-8 rounded-2xl">
        <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
          Page-by-Page Content Manager
        </h3>
        <p className="text-lg text-espresso uppercase tracking-widest font-medium mt-2">
          Select a page to edit every text, image, and link that appears on your website
        </p>
      </div>

      {/* Page Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page, i) => (
          <motion.div
            key={page.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/admin/pages/${page.slug}`}>
              <div className="bg-[#FFFFFF] border border-[#E5E2DE] shadow-sm p-8 rounded-2xl hover:border-[#D4B88A]/80 transition-all group cursor-pointer h-full">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${page.color}15` }}
                >
                  <page.icon size={24} style={{ color: page.color }} />
                </div>

                {/* Title */}
                <h4 className="font-cormorant text-3xl italic font-bold text-[#1A1A1A] mb-3 group-hover:text-[#D4B88A] transition-colors">
                  {page.title}
                </h4>

                {/* Description */}
                <p className="text-lg text-espresso leading-relaxed mb-6 font-medium">
                  {page.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg uppercase tracking-[0.2em] text-espresso font-bold">
                    {page.sections} Sections
                  </span>
                  <div className="flex items-center gap-1.5 text-lg uppercase tracking-[0.2em] text-[#D4B88A] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Edit</span>
                    <ExternalLink size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

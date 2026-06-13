"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag as StoreIcon,
  Settings,
  Image as ImageIcon,
  Layers,
  Search,
  Bell,
  Home
} from "lucide-react";
import { SessionProvider } from "next-auth/react";

export default function AdminSidebarWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const adminRole = session?.user?.adminRole || "secondary";
  const isPrimary = adminRole === "primary";

  const menuGroups = [
    {
      title: "Main",
      items: [
        { icon: LayoutDashboard, label: "Overview", href: "/admin" },
        { icon: ShoppingBag, label: "Products", href: "/admin/products" },
        { icon: Layers, label: "Categories", href: "/admin/categories" },
        { icon: Users, label: "Orders", href: "/admin/orders" },
      ]
    },
    {
      title: "Content",
      items: [
        { icon: FileText, label: "CMS Content", href: "/admin/content" },
        { icon: FileText, label: "Pages", href: "/admin/pages" },
        { icon: ImageIcon, label: "Media", href: "/admin/media" },
      ]
    },
    ...(isPrimary ? [{
      title: "System",
      items: [
        { icon: Settings, label: "Settings", href: "/admin/settings" }
      ]
    }] : [])
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const currentLabel = menuGroups.flatMap(g => g.items).find(item => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2D2D] flex font-inter">
      {/* Collapsible Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-[#FFFFFF] border-r border-[#F0EBE1] flex flex-col fixed h-full z-50 select-none overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
      >
        {/* Header Block */}
        <div className="px-6 py-8 flex items-center justify-between border-b border-[#F0EBE1]">
          <Link href="/admin" className="flex items-center gap-3">
            <Sparkles className="text-[#D4B06A] w-6 h-6 flex-shrink-0" />
            {!collapsed && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-playfair text-3xl font-medium tracking-wide text-[#2D2D2D]"
              >
                Za<span className="text-[#D4B06A]">f</span>oria
              </motion.h1>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-7 h-7 items-center justify-center rounded-md bg-[#FAF8F5] hover:bg-[#F0EBE1] text-[#2D2D2D] transition-colors border border-[#E5E2DE]"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Admin Role Badge */}
        {!collapsed && (
          <div className="px-6 py-5">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border ${
              isPrimary 
                ? "bg-[#D4B06A]/10 text-[#A6864A] border-[#D4B06A]/20" 
                : "bg-[#F5F5F5] text-[#666666] border-[#E5E5E5]"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isPrimary ? "bg-[#D4B06A]" : "bg-[#999999]"}`} />
              {isPrimary ? "Primary Administrator" : "Secondary Staff"}
            </div>
          </div>
        )}

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[11px] font-semibold text-[#999999] uppercase tracking-widest mb-2 mt-4">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link key={item.label} href={item.href}>
                    <motion.div
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group ${
                        isActive
                          ? "bg-[#FAF8F5] text-[#D4B06A]"
                          : "text-[#666666] hover:bg-[#FAF8F5] hover:text-[#2D2D2D]"
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#D4B06A] rounded-r-full" 
                        />
                      )}
                      <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? "text-[#D4B06A]" : "text-[#999999] group-hover:text-[#2D2D2D]"}`} />
                      {!collapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {item.label}
                        </motion.span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Action Buttons at Sidebar Footer */}
        <div className="p-4 border-t border-[#F0EBE1] space-y-1 bg-[#FFFFFF]">
          <Link href="/">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#666666] hover:bg-[#FAF8F5] hover:text-[#2D2D2D] transition-all cursor-pointer group">
              <StoreIcon className="w-[18px] h-[18px] flex-shrink-0 text-[#999999] group-hover:text-[#2D2D2D]" />
              {!collapsed && <span>View Storefront</span>}
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#C4607A] hover:bg-[#FFF5F7] hover:text-[#B04C64] transition-all cursor-pointer text-left group"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0 text-[#C4607A] group-hover:text-[#B04C64]" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Pane */}
      <motion.div
        animate={{ paddingLeft: collapsed ? 80 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 min-h-screen flex flex-col w-full bg-[#FAF8F5]"
      >
        {/* Dynamic header banner */}
        <header className="sticky top-0 z-40 bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#E5E2DE] px-8 py-5 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[#999999]">
              <Home size={12} />
              <span>/</span>
              <span className="text-[#666666]">{currentLabel}</span>
            </div>
            <h2 className="font-playfair text-[28px] text-[#2D2D2D] font-medium tracking-tight">
              {currentLabel}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Mock Search Bar */}
            <div className="hidden lg:flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E2DE] px-3 py-2 rounded-lg shadow-sm w-64 focus-within:border-[#D4B06A] transition-colors">
              <Search size={16} className="text-[#999999]" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#999999] text-[#2D2D2D]"
              />
              <div className="flex items-center justify-center px-1.5 py-0.5 rounded border border-[#E5E2DE] bg-[#FAF8F5] text-[10px] text-[#999999] font-medium">
                ⌘K
              </div>
            </div>

            <button className="relative text-[#666666] hover:text-[#2D2D2D] transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#C4607A] rounded-full border-2 border-[#FAF8F5]" />
            </button>

            <div className="h-6 w-px bg-[#E5E2DE]" />

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-[#2D2D2D] leading-tight group-hover:text-[#D4B06A] transition-colors">
                  {session?.user?.name || "Administrator"}
                </span>
                <span className="text-[11px] text-[#999999] font-medium">
                  {session?.user?.email}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#D4B06A]/10 border border-[#D4B06A]/30 flex items-center justify-center text-[#D4B06A] font-playfair font-bold text-lg shadow-sm">
                {(session?.user?.name || "A")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page children wrapped in exit transition */}
        <div className="flex-1 p-8">
          <SessionProvider session={session}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </SessionProvider>
        </div>
      </motion.div>
    </div>
  );
}

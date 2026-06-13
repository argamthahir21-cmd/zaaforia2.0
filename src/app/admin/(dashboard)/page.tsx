"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  AlertTriangle,
  RefreshCw,
  Check,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/lib/hooks";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { data: rawProducts, isLoading: loadingProducts } = useProducts({ size: 100 });
  const products = (rawProducts as any)?.content || [];

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const lowStockProducts = products.filter((p: any) => p.stock <= 5);

  // Compute stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;

  const stats = [
    {
      label: "Total Sales",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "+12.4%",
      up: true,
      icon: DollarSign,
      color: "#D4B06A",
      bgColor: "#D4B06A15"
    },
    {
      label: "Live Orders",
      value: totalOrdersCount.toString(),
      change: `+${orders.filter(o => o.status === 'confirmed').length} new`,
      up: true,
      icon: ShoppingBag,
      color: "#2D2D2D",
      bgColor: "#2D2D2D10"
    },
    {
      label: "Low Stock Items",
      value: lowStockProducts.length.toString(),
      change: lowStockProducts.length > 0 ? "Needs restock" : "All clear",
      up: lowStockProducts.length === 0,
      icon: AlertTriangle,
      color: "#C4607A",
      bgColor: "#C4607A15"
    },
    {
      label: "Growth Index",
      value: "18.4%",
      change: "+4.3%",
      up: true,
      icon: TrendingUp,
      color: "#8FA68A",
      bgColor: "#8FA68A15"
    },
  ];

  return (
    <div className="space-y-6 text-[#2D2D2D] font-inter">
      {/* Top Header stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#FFFFFF] border border-[#E5E2DE] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 rounded-2xl flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.bgColor }}
              >
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <div
                className={`flex items-center gap-1 text-[13px] font-semibold px-2 py-1 rounded-md ${
                  stat.up ? "bg-[#8FA68A]/10 text-[#6B8566]" : "bg-[#C4607A]/10 text-[#B04C64]"
                }`}
              >
                <ArrowUpRight size={14} className={stat.up ? "" : "rotate-180"} />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-[13px] text-[#666666] font-medium mb-1">
                {stat.label}
              </p>
              <p className="font-playfair text-[32px] font-medium text-[#2D2D2D] leading-none">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grid: Charts + Side Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart: SVG Line plot */}
        <div className="bg-[#FFFFFF] border border-[#E5E2DE] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[18px] font-semibold text-[#2D2D2D]">
                Revenue Performance
              </h3>
              <p className="text-[13px] text-[#666666] mt-1">
                Daily Sales Activity (INR)
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#2D2D2D] font-medium bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E5E2DE]">
              <span className="w-2 h-2 rounded-full bg-[#D4B06A]" />
              <span>Current Term</span>
            </div>
          </div>

          {/* Premium custom SVG vector line chart */}
          <div className="relative h-72 w-full flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4B06A" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#D4B06A" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal Grid lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#F5F5F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F5F5F5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#F5F5F5" strokeWidth="1" strokeDasharray="4 4" />

              {/* Area path */}
              <path
                d="M 0 170 Q 100 130 200 110 T 400 60 L 500 40 L 500 200 L 0 200 Z"
                fill="url(#chartGrad)"
              />
              {/* Line path */}
              <path
                d="M 0 170 Q 100 130 200 110 T 400 60 L 500 40"
                fill="none"
                stroke="#D4B06A"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Chart dots */}
              <circle cx="200" cy="110" r="5" fill="#FFFFFF" stroke="#D4B06A" strokeWidth="2.5" className="hover:r-6 transition-all" />
              <circle cx="400" cy="60" r="5" fill="#FFFFFF" stroke="#D4B06A" strokeWidth="2.5" className="hover:r-6 transition-all" />
              <circle cx="500" cy="40" r="5" fill="#FFFFFF" stroke="#D4B06A" strokeWidth="2.5" className="hover:r-6 transition-all" />
            </svg>

            {/* X Axis Labels */}
            <div className="absolute bottom-0 translate-y-full left-0 right-0 flex justify-between px-1 text-[11px] text-[#999999] font-medium pt-3">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alert box */}
        <div className="bg-[#FFFFFF] border border-[#E5E2DE] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-4">
              Inventory Alerts
            </h3>
            {loadingProducts ? (
              <div className="space-y-3">
                <div className="skeleton h-14 w-full rounded-xl bg-[#E5E2DE]/30" />
                <div className="skeleton h-14 w-full rounded-xl bg-[#E5E2DE]/30" />
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="bg-[#FAF8F5] border border-[#E5E2DE] p-6 rounded-xl text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-[#8FA68A]/10 rounded-full flex items-center justify-center mb-3">
                  <Check className="text-[#8FA68A]" size={20} />
                </div>
                <p className="text-[14px] text-[#2D2D2D] font-medium">Inventory is healthy</p>
                <p className="text-[12px] text-[#999999] mt-1">No low stock items detected.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {lowStockProducts.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-3 bg-[#FAF8F5] border border-[#E5E2DE] rounded-xl hover:border-[#D4B06A]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-[#E5E2DE] overflow-hidden rounded-md relative shadow-sm">
                        {p.images?.[0] && (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#2D2D2D] truncate max-w-[120px]">{p.name}</p>
                        <p className="text-[11px] text-[#666666] capitalize mt-0.5">
                          {p.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] text-[#C4607A] font-semibold bg-[#C4607A]/10 px-2 py-0.5 rounded">
                        {p.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link href="/admin/products" className="mt-6">
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#FAF8F5] border border-[#E5E2DE] hover:bg-[#F0EBE1] hover:border-[#D0CBC4] text-[13px] font-semibold rounded-xl text-[#2D2D2D] transition-all shadow-sm">
              Manage Inventory
              <ChevronRight size={14} className="text-[#999999]" />
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-[#FFFFFF] border border-[#E5E2DE] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-[18px] font-semibold text-[#2D2D2D]">
              Recent Transactions
            </h3>
            <p className="text-[13px] text-[#666666] mt-1">
              Latest confirmed orders and checkouts
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E2DE] hover:bg-[#F0EBE1] text-[#2D2D2D] rounded-lg transition-all text-sm font-medium"
          >
            <RefreshCw size={14} className={loadingOrders ? "animate-spin text-[#D4B06A]" : "text-[#999999]"} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {loadingOrders ? (
          <div className="space-y-3">
            <div className="skeleton h-12 w-full rounded-xl bg-[#E5E2DE]/30" />
            <div className="skeleton h-12 w-full rounded-xl bg-[#E5E2DE]/30" />
            <div className="skeleton h-12 w-full rounded-xl bg-[#E5E2DE]/30" />
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-[#E5E2DE] border-dashed bg-[#FAF8F5] p-10 rounded-xl text-center flex flex-col items-center">
            <ShoppingBag className="text-[#999999] mb-3" size={32} />
            <p className="text-[15px] font-semibold text-[#2D2D2D]">No transactions found</p>
            <p className="text-[13px] text-[#666666] mt-1">Orders will appear here once customers checkout.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E2DE]">
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-[#999999] font-semibold pl-4">Order Code</th>
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-[#999999] font-semibold">Customer</th>
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-[#999999] font-semibold">Total Amount</th>
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-[#999999] font-semibold">Destination</th>
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-[#999999] font-semibold text-right pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2DE]/50">
                {orders.slice(0, 5).map((order) => (
                  <tr 
                    key={order._id} 
                    onClick={() => router.push('/admin/orders')}
                    className="hover:bg-[#FAF8F5] transition-colors group cursor-pointer"
                  >
                    <td className="py-4 pl-4 text-[14px] font-medium text-[#2D2D2D] font-variant-numeric: tabular-nums">
                      #{order._id?.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 text-[14px] text-[#666666]">
                      {order.guestEmail || "Member Account"}
                    </td>
                    <td className="py-4 text-[14px] font-semibold text-[#2D2D2D] font-variant-numeric: tabular-nums">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="py-4 text-[14px] text-[#666666] truncate max-w-[150px]">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-semibold bg-[#8FA68A]/10 text-[#6B8566] border border-[#8FA68A]/20">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Clock, Star, Edit3, ShieldCheck, Sparkles, X } from "lucide-react";
import { useAuthStore, useSceneStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecommendations } from "@/lib/hooks";
import Link from "next/link";

// removed mock orders

const tabs = [
  { label: "Orders", icon: Package },
  { label: "Addresses", icon: MapPin },
  { label: "Settings", icon: Settings },
  { label: "For You", icon: Sparkles },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Orders");
  const { user, logout } = useAuthStore();
  const { setSceneState } = useSceneStore();
  const router = useRouter();
  const { data: recommendations, isLoading: loadingRecs } = useRecommendations();
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  
  const [selectedCountryCode, setSelectedCountryCode] = useState("IN");
  const [selectedStateCode, setSelectedStateCode] = useState("");

  useEffect(() => {
    if (editingAddress) {
      const cCode = Country.getAllCountries().find(c => c.name === editingAddress.country)?.isoCode || "IN";
      setSelectedCountryCode(cCode);
      const sCode = State.getStatesOfCountry(cCode).find(s => s.name === editingAddress.state)?.isoCode || "";
      setSelectedStateCode(sCode);
    } else {
      setSelectedCountryCode("IN");
      setSelectedStateCode("");
    }
  }, [editingAddress]);

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(selectedCountryCode);
  const citiesList = City.getCitiesOfState(selectedCountryCode, selectedStateCode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, profileRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/auth/profile")
        ]);
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (profileRes.ok) setProfile(await profileRes.json());
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoadingData(false);
      }
    };
    if (user) {
      fetchData();
    } else {
      setLoadingData(false);
    }
  }, [user]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newAddr = {
      name: formData.get("name") as string,
      line1: formData.get("line1") as string,
      line2: formData.get("line2") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postal: formData.get("postal") as string,
      country: formData.get("country") as string,
    };

    let updatedAddresses = [...(profile?.savedAddresses || [])];
    
    if (editingAddress?._id) {
      updatedAddresses = updatedAddresses.map(a => a._id === editingAddress._id ? { ...newAddr, _id: a._id } : a);
    } else {
      updatedAddresses.push(newAddr);
    }

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedAddresses: updatedAddresses })
      });
      if (res.ok) {
        setProfile(await res.json());
        setIsAddressModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setSceneState("dashboard");
  }, [setSceneState]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-transparent pt-20 pb-12 pointer-events-none">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 pointer-events-auto">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-3xl p-8 shadow-luxury mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-champagne to-rose/20 p-1">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden relative">
                {user?.avatar ? (
                  <Image src={user.avatar} alt="Profile" fill className="object-cover" />
                ) : (
                  <User size={36} className="text-espresso" />
                )}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-gold rounded-full border-2 border-white flex items-center justify-center text-white shadow-md transform translate-x-2 transition-transform group-hover:scale-110">
              <Edit3 size={12} />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="font-playfair text-4xl text-espresso font-semibold">{user?.name || "VIP Guest"}</h1>
              <ShieldCheck size={20} className="text-gold" />
            </div>
            <p className="font-poppins text-base text-espresso tracking-wide">{user?.email || "guest@zaaforia.com"}</p>
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 bg-champagne/30 rounded-full">
              <Star size={14} className="text-gold fill-gold" />
              <span className="font-poppins text-sm font-semibold text-espresso uppercase tracking-widest">Zaaforia Elite</span>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="md:ml-auto flex items-center gap-2 px-6 py-3 bg-espresso text-white rounded-xl text-sm font-poppins font-semibold uppercase tracking-wider hover:bg-gold transition-colors shadow-sm"
          >
            <LogOut size={16} /> Sign Out
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-2xl shadow-luxury overflow-hidden p-2 space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.label;
                return (
                  <button 
                    key={tab.label} 
                    onClick={() => setActiveTab(tab.label)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-base font-poppins transition-all relative ${isActive ? "text-espresso font-semibold" : "text-espresso hover:bg-champagne/10 hover:text-espresso"}`}
                  >
                    {isActive && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-champagne/20 rounded-xl" />
                    )}
                    <tab.icon size={18} className={`relative z-10 ${isActive ? "text-gold" : "text-espresso"}`} /> 
                    <span className="relative z-10">{tab.label}</span>
                    {isActive && <ChevronRight size={16} className="relative z-10 ml-auto text-gold" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "Orders" && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="font-playfair text-3xl text-espresso font-semibold tracking-wide">Recent Orders</h2>
                  
                  <div className="space-y-4">
                    {loadingData ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-champagne/20 rounded-2xl w-full"></div>)}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl shadow-luxury">
                        <Package size={32} className="mx-auto text-gold mb-4" />
                        <p className="font-poppins text-base text-espresso mb-4">You haven't placed any orders yet.</p>
                        <Link href="/shop"><button className="px-6 py-2 bg-espresso text-white rounded-xl text-sm font-poppins font-semibold uppercase tracking-wider hover:bg-gold transition-colors">Start Shopping</button></Link>
                      </div>
                    ) : orders.map((order, i) => (
                      <motion.div 
                        key={order._id} 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className="bg-white rounded-2xl p-6 shadow-luxury flex flex-col md:flex-row items-center gap-6 cursor-pointer border border-transparent hover:border-champagne transition-all"
                      >
                        {/* Order Image Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0">
                          {order.items?.[0]?.image ? (
                            <Image src={order.items[0].image} alt="Order" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-champagne/20 flex items-center justify-center"><Package size={20} className="text-gold" /></div>
                          )}
                        </div>
                        
                        <div className="flex-1 text-center md:text-left">
                          <p className="font-poppins text-base font-bold text-espresso tracking-wide">#{order._id?.slice(-8).toUpperCase()}</p>
                          <p className="text-sm font-poppins text-espresso mt-1 flex items-center justify-center md:justify-start gap-1">
                            <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} item(s)
                          </p>
                          {order.trackingNumber && (
                            <p className="text-xs font-poppins text-gold mt-1">Tracking: {order.trackingNumber}</p>
                          )}
                        </div>
                        
                        <div className="text-center md:text-right">
                          <p className="font-poppins text-xl font-bold text-espresso">₹{(order.total || 0).toLocaleString()}</p>
                          <div className="mt-2">
                            <span className={`text-[10px] font-poppins font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${
                              order.status === "delivered" ? "bg-green-50 text-green-700 border border-green-200" : 
                              order.status === "shipped" ? "bg-blue-50 text-blue-700 border border-blue-200" : 
                              "bg-gold/10 text-gold border border-gold/20"
                            }`}>
                              {order.status || "Processing"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="hidden md:flex w-10 h-10 rounded-full bg-ivory items-center justify-center hover:bg-champagne transition-colors">
                          <ChevronRight size={18} className="text-espresso" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "Addresses" && (
                <motion.div 
                  key="addresses"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-playfair text-3xl text-espresso font-semibold tracking-wide">Saved Addresses</h2>
                    <button 
                      onClick={() => { setEditingAddress(null); setIsAddressModalOpen(true); }}
                      className="text-sm font-poppins font-semibold text-gold uppercase tracking-wider hover:underline"
                    >
                      + Add New
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {profile?.savedAddresses?.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl shadow-luxury">
                        <MapPin size={32} className="mx-auto text-gold mb-4" />
                        <p className="font-poppins text-base text-espresso">You have no saved addresses.</p>
                      </div>
                    ) : (
                      profile?.savedAddresses?.map((addr: any, i: number) => (
                        <div key={addr._id || i} className="bg-white rounded-2xl p-6 shadow-luxury border border-transparent hover:border-gold/30 transition-all cursor-pointer relative overflow-hidden">
                          {i === 0 && <div className="absolute top-0 left-0 w-1 h-full bg-gold" />}
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-champagne/30 flex items-center justify-center shrink-0">
                              <MapPin size={18} className="text-gold" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <p className="font-poppins text-base font-bold text-espresso uppercase tracking-wide">{addr.name}</p>
                                {i === 0 && <span className="px-2 py-0.5 bg-espresso text-white text-[9px] font-poppins font-bold uppercase tracking-widest rounded-sm">Primary</span>}
                              </div>
                              <p className="font-poppins text-base text-espresso mt-2 leading-relaxed max-w-md">
                                {addr.line1}<br />
                                {addr.line2 && <>{addr.line2}<br /></>}
                                {addr.city}, {addr.state} {addr.postal}<br />
                                {addr.country}
                              </p>
                            </div>
                            <button 
                              onClick={() => { setEditingAddress(addr); setIsAddressModalOpen(true); }}
                              className="text-espresso hover:text-gold transition-colors p-2"
                            >
                              <Edit3 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "Settings" && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-playfair text-3xl text-espresso font-semibold tracking-wide mb-6">Account Settings</h2>
                  <div className="bg-white rounded-2xl p-8 shadow-luxury space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="font-poppins text-sm font-semibold text-espresso uppercase tracking-wider">Full Name</label>
                        <input type="text" defaultValue={user?.name || ""} className="w-full py-3 px-4 bg-ivory/50 border border-champagne rounded-xl text-base font-poppins text-espresso focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-poppins text-sm font-semibold text-espresso uppercase tracking-wider">Email Address</label>
                        <input type="email" defaultValue={user?.email || ""} className="w-full py-3 px-4 bg-ivory/50 border border-champagne rounded-xl text-base font-poppins text-espresso focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="font-poppins text-sm font-semibold text-espresso uppercase tracking-wider">Phone Number</label>
                        <input type="tel" defaultValue="+91 98765 43210" className="w-full py-3 px-4 bg-ivory/50 border border-champagne rounded-xl text-base font-poppins text-espresso focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-champagne/50">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3.5 bg-espresso text-white text-sm font-poppins font-bold uppercase tracking-widest rounded-xl hover:bg-gold transition-colors shadow-md"
                      >
                        Save Preferences
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "For You" && (
                <motion.div 
                  key="foryou"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles size={24} className="text-gold" />
                    <h2 className="font-playfair text-3xl text-espresso font-semibold tracking-wide">Personalized Recommendations</h2>
                  </div>
                  <p className="font-poppins text-base text-espresso mb-8">Curated luxury pieces selected exclusively for your unique taste.</p>
                  
                  {loadingRecs ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex flex-col gap-3">
                          <div className="bg-champagne/20 aspect-[3/4] rounded-xl w-full"></div>
                          <div className="h-4 bg-champagne/20 rounded w-2/3"></div>
                          <div className="h-4 bg-champagne/20 rounded w-1/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : recommendations && recommendations.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {recommendations.slice(0, 6).map((product: any) => (
                        <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#F5F0EB] mb-3">
                            {product.images?.[0] && (
                              <Image 
                                src={product.images[0]} 
                                alt={product.name} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                              />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                          <h3 className="font-poppins text-sm font-semibold text-espresso uppercase tracking-wider mb-1 truncate">{product.name}</h3>
                          <p className="font-playfair text-base text-espresso">₹{product.price.toLocaleString()}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-luxury">
                      <Sparkles size={32} className="mx-auto text-gold mb-4" />
                      <p className="font-poppins text-base text-espresso">Check back later for personalized recommendations.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Address Modal */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] p-10 md:p-14 max-w-2xl w-full relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            >
              <button 
                onClick={() => setIsAddressModalOpen(false)}
                className="absolute top-8 right-8 text-espresso/60 hover:text-espresso"
              >
                <X size={28} />
              </button>
              
              <h3 className="font-playfair text-4xl font-semibold text-espresso mb-10">
                {editingAddress ? "Edit Address" : "Add Address"}
              </h3>
              
              <form onSubmit={handleSaveAddress} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-poppins font-semibold uppercase tracking-wider text-espresso/70 mb-2">Address Label</label>
                  <input name="name" required defaultValue={editingAddress?.name || ""} placeholder="e.g. Home, Office" className="w-full h-[64px] bg-[#FAFAF7] border border-[#E5E2DE] px-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold transition-colors leading-normal" />
                </div>
                <div>
                  <label className="block text-sm font-poppins font-semibold uppercase tracking-wider text-espresso/70 mb-2">Address Line 1</label>
                  <input name="line1" required defaultValue={editingAddress?.line1 || ""} className="w-full h-[64px] bg-[#FAFAF7] border border-[#E5E2DE] px-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold transition-colors leading-normal" />
                </div>
                <div>
                  <label className="block text-sm font-poppins font-semibold uppercase tracking-wider text-espresso/70 mb-2">Address Line 2 (Optional)</label>
                  <input name="line2" defaultValue={editingAddress?.line2 || ""} className="w-full h-[64px] bg-[#FAFAF7] border border-[#E5E2DE] px-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold transition-colors leading-normal" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-poppins font-semibold uppercase tracking-wider text-espresso/70 mb-2">Country</label>
                    <select 
                      name="country" 
                      required 
                      defaultValue={editingAddress?.country || "India"} 
                      onChange={(e) => {
                         const cCode = countries.find(c => c.name === e.target.value)?.isoCode;
                         setSelectedCountryCode(cCode || "");
                         setSelectedStateCode("");
                      }}
                      className="w-full h-[64px] bg-[#FAFAF7] border border-[#E5E2DE] px-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold transition-colors leading-normal appearance-none cursor-pointer"
                    >
                      <option value="">Select Country</option>
                      {countries.map(c => <option key={c.isoCode} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-poppins font-semibold uppercase tracking-wider text-espresso/70 mb-2">State</label>
                    {states.length > 0 ? (
                      <select 
                        name="state" 
                        required 
                        defaultValue={editingAddress?.state || ""} 
                        onChange={(e) => {
                           const sCode = states.find(s => s.name === e.target.value)?.isoCode;
                           setSelectedStateCode(sCode || "");
                        }}
                        className="w-full h-[64px] bg-[#FAFAF7] border border-[#E5E2DE] px-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold transition-colors leading-normal appearance-none cursor-pointer"
                      >
                        <option value="">Select State</option>
                        {states.map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
                      </select>
                    ) : (
                      <input name="state" required defaultValue={editingAddress?.state || ""} className="w-full h-[64px] bg-[#FAFAF7] border border-[#E5E2DE] px-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold transition-colors leading-normal" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-poppins font-semibold uppercase tracking-wider text-espresso/70 mb-2">City / District</label>
                    {citiesList.length > 0 ? (
                      <select 
                        name="city" 
                        required 
                        defaultValue={editingAddress?.city || ""} 
                        className="w-full h-[64px] bg-[#FAFAF7] border border-[#E5E2DE] px-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold transition-colors leading-normal appearance-none cursor-pointer"
                      >
                        <option value="">Select City / District</option>
                        {citiesList.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    ) : (
                      <input name="city" required defaultValue={editingAddress?.city || ""} className="w-full h-[64px] bg-[#FAFAF7] border border-[#E5E2DE] px-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold transition-colors leading-normal" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-poppins font-semibold uppercase tracking-wider text-espresso/70 mb-2">Postal Code</label>
                    <input name="postal" required defaultValue={editingAddress?.postal || ""} className="w-full h-[64px] bg-[#FAFAF7] border border-[#E5E2DE] px-6 rounded-2xl font-poppins text-lg focus:outline-none focus:border-gold transition-colors leading-normal" />
                  </div>
                </div>
                <div className="pt-6">
                  <button type="submit" className="w-full h-[72px] bg-espresso text-white rounded-2xl font-poppins font-bold uppercase tracking-widest text-lg hover:bg-gold transition-colors shadow-lg">
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

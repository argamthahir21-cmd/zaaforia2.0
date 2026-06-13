"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, MapPin, Package, ArrowRight, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const steps = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { items, clearCart, getTotal } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit / Debit Card (Stripe)");
  const [liveItems, setLiveItems] = useState(items);
  const [settings, setSettings] = useState({ deliveryAmount: 149, freeDeliveryThreshold: 2999 });
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: session?.user?.email || "",
    address: "",
    city: "",
    state: "",
    pin: "",
    country: "India",
  });

  useEffect(() => {
    if (searchParams.get("success")) {
      setSuccess(true);
      clearCart();
    }
  }, [searchParams, clearCart]);

  useEffect(() => {
    // Fetch live settings and product prices
    const fetchData = async () => {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          fetch("/api/settings"),
          items.length > 0 ? fetch(`/api/products?ids=${items.map((i) => i.product.id || (i.product as any)._id).join(",")}`) : Promise.resolve(null),
        ]);

        if (settingsRes.ok) {
          const s = await settingsRes.json();
          setSettings(s);
        }

        if (productsRes && productsRes.ok) {
          const pData = await productsRes.json();
          const liveProducts = pData.content;
          const updatedItems = items.map((item) => {
            const lp = liveProducts.find((p: any) => p.id === item.product.id || p.id === (item.product as any)._id);
            return lp ? { ...item, product: lp } : item;
          });
          setLiveItems(updatedItems);
        } else {
          setLiveItems(items);
        }
      } catch (e) {
        console.error("Failed to load live data", e);
      }
    };
    fetchData();
  }, [items]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/auth/profile")
        .then(res => res.json())
        .then(data => {
          if (data.savedAddresses) {
            setSavedAddresses(data.savedAddresses);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const subtotal = liveItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = 0; // Simplified for checkout demo
  const shipping = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryAmount;
  const total = subtotal + shipping - discount;

  const handlePlaceOrder = async () => {
    if (liveItems.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: liveItems,
          email: formData.email,
          userId: (session?.user as any)?.id || "",
          paymentMethod,
          shippingAddress: formData,
          subtotal,
          shipping,
          total,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Failed to initiate checkout");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating checkout. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="bg-white p-12 rounded-xl shadow-card text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="font-playfair text-4xl text-espresso mb-4">Order Placed Successfully!</h1>
          <p className="text-base font-poppins text-espresso mb-8">
            Thank you for shopping with Zaforia. Your luxury pieces are being prepared for dispatch.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-espresso text-white rounded-xl text-base font-poppins font-semibold hover:bg-gold hover:text-espresso transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-start pt-24 pb-12">
      <div className="w-full max-w-2xl px-6">
        <h1 className="font-playfair text-5xl text-espresso text-center mb-12">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div animate={{ scale: i === currentStep ? 1.1 : 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-poppins font-semibold transition-colors ${i < currentStep ? "bg-gold text-white" : i === currentStep ? "bg-espresso text-white" : "bg-champagne/40 text-espresso"}`}>
                  {i < currentStep ? <Check size={16} /> : i + 1}
                </motion.div>
                <span className={`text-[10px] font-poppins mt-2 ${i <= currentStep ? "text-espresso" : "text-espresso"}`}>{step}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-16 md:w-24 h-[2px] mx-3 mt-[-16px] ${i < currentStep ? "bg-gold" : "bg-champagne/40"}`} />}
            </div>
          ))}
        </div>

        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          className="bg-white rounded-xl p-8 shadow-card">

          {currentStep === 0 && (
            <div className="w-full py-4">
              <h2 className="font-playfair text-3xl text-espresso mb-8 flex items-center justify-center gap-3 text-center"><MapPin size={24} className="text-gold" /> Shipping Address</h2>
              
              {savedAddresses.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-poppins font-semibold text-espresso uppercase tracking-wider mb-4 text-center">Use a saved address</p>
                  <div className="flex flex-col gap-3">
                    {savedAddresses.map((addr, i) => (
                      <div 
                        key={i} 
                        onClick={() => setFormData({
                          ...formData,
                          firstName: addr.name.split(" ")[0] || "",
                          lastName: addr.name.split(" ").slice(1).join(" ") || "",
                          address: addr.line1,
                          city: addr.city,
                          state: addr.state,
                          pin: addr.postal,
                          country: addr.country,
                        })}
                        className="p-4 border border-champagne rounded-xl cursor-pointer hover:border-gold hover:bg-champagne/10 transition-colors"
                      >
                        <p className="font-poppins font-semibold text-espresso">{addr.name}</p>
                        <p className="font-poppins text-sm text-[#666666]">{addr.line1}, {addr.city}, {addr.state} - {addr.postal}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 border-t border-champagne"></div>
                    <span className="text-[10px] font-poppins uppercase tracking-widest text-[#999999]">OR ENTER NEW</span>
                    <div className="flex-1 border-t border-champagne"></div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-6">
                
                <div className="space-y-2">
                  <label className="block text-sm font-poppins font-semibold text-espresso uppercase tracking-wider text-center">First Name <span className="text-[#C4607A]">*</span></label>
                  <input type="text" placeholder="Enter first name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full py-4 px-5 border border-champagne bg-white shadow-sm rounded-xl text-center text-lg font-poppins focus:outline-none focus:border-gold transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-poppins font-semibold text-espresso uppercase tracking-wider text-center">Last Name <span className="text-[#C4607A]">*</span></label>
                  <input type="text" placeholder="Enter last name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full py-4 px-5 border border-champagne bg-white shadow-sm rounded-xl text-center text-lg font-poppins focus:outline-none focus:border-gold transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-poppins font-semibold text-espresso uppercase tracking-wider text-center">Phone Number <span className="text-[#999999] font-normal lowercase tracking-normal">(Optional)</span></label>
                  <input type="text" placeholder="Enter phone number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full py-4 px-5 border border-champagne bg-white shadow-sm rounded-xl text-center text-lg font-poppins focus:outline-none focus:border-gold transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-poppins font-semibold text-espresso uppercase tracking-wider text-center">Email Address <span className="text-[#C4607A]">*</span></label>
                  <input type="email" placeholder="Enter email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full py-4 px-5 border border-champagne bg-white shadow-sm rounded-xl text-center text-lg font-poppins focus:outline-none focus:border-gold transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-poppins font-semibold text-espresso uppercase tracking-wider text-center">Street Address <span className="text-[#C4607A]">*</span></label>
                  <input type="text" placeholder="House number and street name" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full py-4 px-5 border border-champagne bg-white shadow-sm rounded-xl text-center text-lg font-poppins focus:outline-none focus:border-gold transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-poppins font-semibold text-espresso uppercase tracking-wider text-center">City <span className="text-[#C4607A]">*</span></label>
                  <input type="text" placeholder="Enter city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full py-4 px-5 border border-champagne bg-white shadow-sm rounded-xl text-center text-lg font-poppins focus:outline-none focus:border-gold transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-poppins font-semibold text-espresso uppercase tracking-wider text-center">State <span className="text-[#C4607A]">*</span></label>
                  <input type="text" placeholder="Enter state" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full py-4 px-5 border border-champagne bg-white shadow-sm rounded-xl text-center text-lg font-poppins focus:outline-none focus:border-gold transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-poppins font-semibold text-espresso uppercase tracking-wider text-center">PIN Code <span className="text-[#C4607A]">*</span></label>
                  <input type="text" placeholder="Postal code" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} className="w-full py-4 px-5 border border-champagne bg-white shadow-sm rounded-xl text-center text-lg font-poppins focus:outline-none focus:border-gold transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-poppins font-semibold text-espresso uppercase tracking-wider text-center">Country <span className="text-[#C4607A]">*</span></label>
                  <input type="text" placeholder="Country" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full py-4 px-5 border border-champagne bg-white shadow-sm rounded-xl text-center text-lg font-poppins focus:outline-none focus:border-gold transition-colors" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto py-4 w-full">
              <h2 className="font-playfair text-3xl text-espresso mb-8 flex items-center justify-center gap-3"><CreditCard size={24} className="text-gold" /> Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === "Credit / Debit Card (Stripe)" ? "border-gold bg-champagne/10" : "border-champagne bg-white hover:border-gold"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={paymentMethod === "Credit / Debit Card (Stripe)"} onChange={() => setPaymentMethod("Credit / Debit Card (Stripe)")} className="accent-gold" />
                    <span className="font-poppins text-base text-espresso font-semibold">Credit / Debit Card (Stripe)</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
                </label>
                
                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === "Cash on Delivery" ? "border-gold bg-champagne/10" : "border-champagne bg-white hover:border-gold"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={paymentMethod === "Cash on Delivery"} onChange={() => setPaymentMethod("Cash on Delivery")} className="accent-gold" />
                    <span className="font-poppins text-base text-espresso font-semibold">Cash on Delivery (COD)</span>
                  </div>
                </label>

                {["UPI", "Net Banking"].map((method) => (
                  <label key={method} className="flex items-center gap-3 p-4 border border-champagne rounded-xl bg-[#FAFAF8] cursor-not-allowed opacity-60">
                    <input type="radio" name="payment" disabled className="accent-gold" />
                    <span className="font-poppins text-base text-espresso">{method} (Coming Soon)</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto py-4">
              <h2 className="font-playfair text-3xl text-espresso mb-8 flex items-center justify-center gap-3"><Package size={24} className="text-gold" /> Order Review</h2>
              
              <div className="space-y-3 mb-6">
                {liveItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-ivory p-3 rounded-lg border border-champagne/40">
                    <div className="flex items-center gap-3">
                      {item.product.images?.[0] && (
                        <div className="w-12 h-16 bg-white overflow-hidden rounded relative">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-poppins text-base text-espresso">{item.product.name}</p>
                        <p className="font-poppins text-sm text-espresso">Qty: {item.quantity} | {item.size} | {item.color}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-playfair text-espresso font-bold text-lg">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                      {item.quantity > 1 && (
                        <p className="text-xs text-[#999999] font-poppins mt-1">₹{item.product.price.toLocaleString()} each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-champagne/15 rounded-xl p-6 space-y-4">
                <div className="flex justify-between text-base font-poppins"><span className="text-espresso">Subtotal</span><span className="text-espresso">₹{subtotal.toLocaleString()}</span></div>
                {discount > 0 && <div className="flex justify-between text-base font-poppins"><span className="text-green-600">Discount</span><span className="text-green-600">-₹{discount.toLocaleString()}</span></div>}
                <div className="flex justify-between text-base font-poppins"><span className="text-espresso">Shipping</span><span className={shipping === 0 ? "text-green-600" : "text-espresso"}>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                <div className="border-t border-champagne/40 pt-4 flex justify-between"><span className="font-playfair text-xl text-espresso">Total</span><span className="font-playfair text-3xl text-espresso font-bold">₹{total.toLocaleString()}</span></div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0 || loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-base font-poppins ${currentStep === 0 || loading ? " cursor-not-allowed" : "border border-espresso/20 text-espresso hover:border-gold hover:text-gold transition-colors"}`}>
            <ArrowLeft size={16} /> Back
          </button>
          
          {currentStep < 2 ? (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-8 py-3 bg-espresso text-white rounded-xl text-base font-poppins font-semibold tracking-wider flex items-center gap-2 hover:bg-gold hover:text-espresso transition-colors">
              Continue <ArrowRight size={16} />
            </motion.button>
          ) : (
            <motion.button whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
              onClick={handlePlaceOrder}
              disabled={loading || liveItems.length === 0}
              className={`px-8 py-3 bg-espresso text-white rounded-xl text-base font-poppins font-semibold tracking-wider flex items-center gap-2 transition-colors ${loading ? " cursor-not-allowed" : "hover:bg-gold hover:text-espresso"}`}>
              {loading ? (
                <>Processing... <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /></>
              ) : (
                <>Place Order <Check size={16} /></>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

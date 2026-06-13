"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  RefreshCw,
  X,
  Truck,
  DollarSign,
  User,
  MapPin,
  Calendar,
} from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(updated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTrackingSubmit = async (orderId: string, trackingNumber: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(updated);
        }
        alert("Tracking number updated successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-[#1A1A1A] font-jost">
      <div className="flex justify-between items-center bg-[#FFFFFF] border border-[#E5E2DE] p-5 rounded-2xl">
        <div>
          <h3 className="text-lg font-semibold uppercase tracking-widest text-[#1A1A1A]">
            Order Management Panel
          </h3>
          <p className="text-lg text-espresso uppercase tracking-wider font-light mt-0.5">
            Monitor transactions, updates shipping codes, and handle order fulfillment statuses
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="w-7 h-7 flex items-center justify-center hover:bg-[#F5F0EB] text-espresso rounded-full transition-colors"
          title="Reload Orders"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-[#E5E2DE] bg-[#FFFFFF] p-12 rounded-xl text-center py-20 text-espresso">
          <ShoppingBag className="mx-auto mb-3 text-espresso" size={40} />
          <p className="text-lg font-medium">No transactions captured yet.</p>
          <p className="text-lg text-espresso mt-1 uppercase tracking-wider">
            Simulate a checkout to view order data
          </p>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E5E2DE] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E5E2DE] bg-[#FAFAF7]">
                  <th className="px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    Buyer
                  </th>
                  <th className="px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    Purchase Date
                  </th>
                  <th className="px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    Total
                  </th>
                  <th className="px-6 py-4 text-lg uppercase tracking-widest text-espresso font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-lg uppercase tracking-widest text-espresso font-semibold">
                    Controls
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-[#E5E2DE] last:border-0 hover:bg-[#F5F0EB] transition-colors"
                  >
                    <td className="px-6 py-4 text-lg font-semibold text-[#1A1A1A] font-variant-numeric: tabular-nums">
                      #{order._id?.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg text-[#1A1A1A] font-medium">
                        {order.shippingAddress?.name || "Customer"}
                      </p>
                      <p className="text-lg text-espresso font-light lowercase">
                        {order.guestEmail || "Member Account"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-lg text-espresso">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-lg font-semibold text-[#1A1A1A] font-variant-numeric: tabular-nums">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-[#F5F0EB] border border-[#E5E2DE] rounded-md px-2 py-1 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A] disabled:"
                      >
                        {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(
                          (status) => (
                            <option key={status} value={status}>
                              {status.toUpperCase()}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-[#F5F0EB] hover:bg-[#D4B88A] hover:text-[#FFFFFF] text-lg uppercase tracking-widest font-medium rounded-lg transition-colors border border-transparent"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details overlay drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-[#FFFFFF] border-l border-[#E5E2DE] shadow-2xl z-50 p-6 text-[#1A1A1A] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E2DE]">
                <h3 className="font-cormorant text-3xl italic text-[#1A1A1A]">
                  Order details: #{selectedOrder._id?.slice(-8).toUpperCase()}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F0EB] transition-colors rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Date & Totals block */}
                <div className="bg-[#F5F0EB] border border-[#E5E2DE] p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-lg text-espresso">
                    <Calendar size={20} />
                    <span>Ordered: {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg text-espresso">
                    <DollarSign size={20} />
                    <span>Total Amount: ₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                  {selectedOrder.stripePaymentId && (
                    <div className="flex items-center gap-2 text-lg text-espresso font-light font-variant-numeric: tabular-nums">
                      <span>Stripe ID: {selectedOrder.stripePaymentId}</span>
                    </div>
                  )}
                </div>

                {/* Delivery details */}
                <div className="bg-[#F5F0EB] border border-[#E5E2DE] p-4 rounded-xl space-y-3">
                  <h4 className="text-lg uppercase tracking-widest text-[#D4B88A] font-semibold">
                    Customer & Address
                  </h4>
                  <div className="flex gap-2 text-lg text-espresso">
                    <User size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#1A1A1A]">{selectedOrder.shippingAddress?.name}</p>
                      <p className="text-lg text-espresso font-light mt-0.5">
                        {selectedOrder.guestEmail || "Registered Customer"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-lg text-espresso">
                    <MapPin size={20} className="flex-shrink-0 mt-0.5" />
                    <div className="font-light">
                      <p>{selectedOrder.shippingAddress?.line1}</p>
                      {selectedOrder.shippingAddress?.line2 && <p>{selectedOrder.shippingAddress?.line2}</p>}
                      <p>
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}
                      </p>
                      <p>
                        {selectedOrder.shippingAddress?.postal}, {selectedOrder.shippingAddress?.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tracking input */}
                <div className="bg-[#F5F0EB] border border-[#E5E2DE] p-4 rounded-xl space-y-3">
                  <h4 className="text-lg uppercase tracking-widest text-[#D4B88A] font-semibold">
                    Shipment Tracker
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="tracking-input"
                      placeholder="Add tracking number..."
                      defaultValue={selectedOrder.trackingNumber || ""}
                      className="flex-1 bg-[#FFFFFF] border border-[#E5E2DE] rounded-lg px-3 py-1.5 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById("tracking-input") as HTMLInputElement;
                        if (input) handleTrackingSubmit(selectedOrder._id, input.value);
                      }}
                      className="px-4 py-1.5 bg-[#D4B88A] text-[#FFFFFF] hover:bg-[#B8847E] font-semibold text-lg uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Truck size={20} />
                      Set
                    </button>
                  </div>
                </div>

                {/* Items purchase breakdown */}
                <div className="space-y-3.5">
                  <h4 className="text-lg uppercase tracking-widest text-espresso font-semibold pl-1">
                    Items Purchase Breakdown
                  </h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-[#F5F0EB] border border-[#E5E2DE] p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-11 bg-[#FFFFFF] rounded overflow-hidden relative flex-shrink-0">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                            )}
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-[#1A1A1A] line-clamp-1">{item.name}</p>
                            <p className="text-lg text-espresso uppercase tracking-widest mt-0.5">
                              {item.size} · {item.color} · Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-[#1A1A1A] font-variant-numeric: tabular-nums">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

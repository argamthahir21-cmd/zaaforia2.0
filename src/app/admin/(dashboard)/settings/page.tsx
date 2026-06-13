"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Shield,
  UserPlus,
  Trash2,
  Mail,
  Lock,
  User,
  AlertTriangle,
  Check,
  RefreshCw,
  Crown,
  Users,
  Truck,
  Save,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  adminRole: string;
  createdAt: string;
}

export default function AdminSettings() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deliverySettings, setDeliverySettings] = useState({ deliveryAmount: 149, freeDeliveryThreshold: 2999 });
  const [savingDelivery, setSavingDelivery] = useState(false);

  const isPrimary = (session?.user as any)?.adminRole === "primary";

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins);
      } else if (res.status === 403) {
        setError("Access denied — Primary admin only");
      }

      const settingsRes = await fetch("/api/settings");
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setDeliverySettings(settingsData);
      }
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.password || !inviteForm.name) {
      setError("All fields are required");
      return;
    }
    setInviting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Secondary admin ${inviteForm.email} invited successfully!`);
        setInviteForm({ name: "", email: "", password: "" });
        setShowInviteForm(false);
        fetchSettings();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.message || "Failed to invite admin");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (email: string) => {
    if (!confirm(`Remove admin access for ${email}? They will be demoted to a regular user.`)) return;
    setRemoving(email);
    setError("");
    try {
      const res = await fetch("/api/admin/invite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Admin ${email} removed successfully`);
        fetchSettings();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.message || "Failed to remove admin");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setRemoving(null);
    }
  };

  const handleSaveDeliverySettings = async () => {
    setSavingDelivery(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliverySettings),
      });
      if (res.ok) {
        setSuccess("Delivery settings updated successfully");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update delivery settings");
      }
    } catch {
      setError("Network error while saving settings");
    } finally {
      setSavingDelivery(false);
    }
  };

  if (!isPrimary) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Shield size={48} className="text-[#C47A7A] mb-4" />
        <h3 className="font-cormorant text-3xl italic text-[#1A1A1A] mb-2">Access Restricted</h3>
        <p className="text-lg text-espresso uppercase tracking-[0.2em] max-w-sm">
          Only the primary administrator can access settings. Contact the main admin for any changes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[#1A1A1A] font-jost max-w-3xl">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E5E2DE] p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={18} className="text-[#D4B88A]" />
          <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]">
            Admin Access Control
          </h3>
        </div>
        <p className="text-lg text-espresso uppercase tracking-widest font-light">
          Manage admin accounts — maximum 2 admins allowed. Only you (primary admin) can modify these settings.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#C47A7A]/10 border border-[#C47A7A]/30 p-4 rounded-xl flex items-center gap-3"
        >
          <AlertTriangle size={20} className="text-[#C47A7A] flex-shrink-0" />
          <p className="text-lg text-[#C47A7A]">{error}</p>
          <button onClick={() => setError("")} className="ml-auto text-[#C47A7A] hover:text-[#C47A7A]">✕</button>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#7DAF8E]/10 border border-[#7DAF8E]/30 p-4 rounded-xl flex items-center gap-3"
        >
          <Check size={20} className="text-[#7DAF8E] flex-shrink-0" />
          <p className="text-lg text-[#7DAF8E]">{success}</p>
        </motion.div>
      )}

      {/* Current Admins List */}
      <div className="bg-[#FFFFFF] border border-[#E5E2DE] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DE]">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#D4B88A]" />
            <h4 className="text-lg uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold">
              Current Administrators
            </h4>
          </div>
          <button
            onClick={fetchSettings}
            className="w-7 h-7 flex items-center justify-center hover:bg-[#F5F0EB] rounded-lg transition-colors"
          >
            <RefreshCw size={20} className={`text-espresso ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            <div className="skeleton h-16 rounded-xl" />
            <div className="skeleton h-16 rounded-xl" />
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between bg-[#F5F0EB] border border-[#E5E2DE] p-4 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    admin.adminRole === "primary" ? "bg-[#D4B88A]/15" : "bg-[#7DAF8E]/15"
                  }`}>
                    {admin.adminRole === "primary" ? (
                      <Crown size={20} className="text-[#D4B88A]" />
                    ) : (
                      <User size={20} className="text-[#7DAF8E]" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-medium text-[#1A1A1A]">{admin.name}</p>
                    <p className="text-lg text-espresso font-light">{admin.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-lg uppercase tracking-[0.2em] font-semibold border ${
                    admin.adminRole === "primary"
                      ? "bg-[#D4B88A]/10 text-[#D4B88A] border-[#D4B88A]/20"
                      : "bg-[#7DAF8E]/10 text-[#7DAF8E] border-[#7DAF8E]/20"
                  }`}>
                    {admin.adminRole}
                  </span>

                  {admin.adminRole === "secondary" && (
                    <button
                      onClick={() => handleRemove(admin.email)}
                      disabled={removing === admin.email}
                      className="p-2 bg-[#F5F0EB] hover:bg-[#C47A7A]/20 hover:text-[#C47A7A] text-espresso rounded-lg transition-colors disabled:"
                      title="Remove Admin"
                    >
                      {removing === admin.email ? (
                        <div className="w-3 h-3 border-2 border-[#C47A7A] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {admins.length < 2 && !showInviteForm && (
              <button
                onClick={() => setShowInviteForm(true)}
                className="w-full border border-dashed border-[#E5E2DE] hover:border-[#D4B88A]/40 p-4 rounded-xl text-center transition-colors group"
              >
                <div className="flex items-center justify-center gap-2 text-lg uppercase tracking-[0.2em] text-espresso group-hover:text-[#D4B88A] font-semibold transition-colors">
                  <UserPlus size={18} />
                  Invite Secondary Admin
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFFFF] border border-[#D4B88A]/30 p-6 rounded-2xl space-y-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <UserPlus size={20} className="text-[#D4B88A]" />
            <h4 className="text-lg uppercase tracking-[0.2em] text-[#D4B88A] font-semibold">
              Invite Secondary Admin
            </h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-lg uppercase tracking-[0.2em] text-espresso font-semibold mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso" />
                <input
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="Enter admin name"
                  className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-xl pl-10 pr-4 py-3 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                />
              </div>
            </div>

            <div>
              <label className="text-lg uppercase tracking-[0.2em] text-espresso font-semibold mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso" />
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-xl pl-10 pr-4 py-3 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                />
              </div>
            </div>

            <div>
              <label className="text-lg uppercase tracking-[0.2em] text-espresso font-semibold mb-1.5 block">
                Login Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso" />
                <input
                  type="password"
                  value={inviteForm.password}
                  onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
                  placeholder="Set a strong password"
                  className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-xl pl-10 pr-4 py-3 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowInviteForm(false)}
              className="flex-1 py-3 rounded-xl border border-[#E5E2DE] bg-transparent hover:bg-[#F5F0EB] text-lg uppercase tracking-[0.2em] transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={inviting}
              className="flex-1 py-3 rounded-xl bg-[#D4B88A] text-[#FFFFFF] hover:bg-[#B8847E] text-lg uppercase tracking-[0.2em] font-bold transition-colors disabled: flex items-center justify-center gap-2"
            >
              {inviting ? (
                <div className="w-4 h-4 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlus size={20} />
              )}
              Send Invite
            </button>
          </div>
        </motion.div>
      )}

      {/* Delivery Settings */}
      <div className="bg-[#FFFFFF] border border-[#E5E2DE] rounded-2xl overflow-hidden mt-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DE]">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-[#D4B88A]" />
            <h4 className="text-lg uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold">
              Delivery Settings
            </h4>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            <div className="skeleton h-16 rounded-xl" />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-lg uppercase tracking-[0.2em] text-espresso font-semibold mb-1.5 block">
                  Flat Delivery Amount (₹)
                </label>
                <input
                  type="number"
                  value={deliverySettings.deliveryAmount}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, deliveryAmount: Number(e.target.value) })}
                  className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-xl px-4 py-3 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                />
                <p className="text-sm font-poppins text-espresso/60 mt-2">The default shipping cost added to orders.</p>
              </div>

              <div>
                <label className="text-lg uppercase tracking-[0.2em] text-espresso font-semibold mb-1.5 block">
                  Free Delivery Threshold (₹)
                </label>
                <input
                  type="number"
                  value={deliverySettings.freeDeliveryThreshold}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full bg-[#F5F0EB] border border-[#E5E2DE] rounded-xl px-4 py-3 text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4B88A]"
                />
                <p className="text-sm font-poppins text-espresso/60 mt-2">Orders above this amount get free shipping.</p>
              </div>
            </div>

            <button
              onClick={handleSaveDeliverySettings}
              disabled={savingDelivery}
              className="px-6 py-3 rounded-xl bg-espresso text-[#FFFFFF] hover:bg-[#D4B88A] text-base font-poppins uppercase tracking-[0.1em] font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {savingDelivery ? (
                <div className="w-4 h-4 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Delivery Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

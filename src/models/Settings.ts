import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  deliveryAmount: { type: Number, default: 149 },
  freeDeliveryThreshold: { type: Number, default: 2999 },
}, { timestamps: true });

export const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

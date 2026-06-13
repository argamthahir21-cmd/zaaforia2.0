import mongoose, { Schema, model, models } from "mongoose";

export interface ISiteContent {
  _id: string;
  key: string;
  value: string;
  type: "text" | "richtext" | "url" | "image";
  fieldType: "heading" | "subheading" | "body" | "cta_text" | "cta_link" | "image" | "label" | "icon";
  page: string;
  section: string;
  label?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: { type: String, enum: ["text", "richtext", "url", "image"], default: "text" },
    fieldType: {
      type: String,
      enum: ["heading", "subheading", "body", "cta_text", "cta_link", "image", "label", "icon"],
      default: "body",
    },
    page: { type: String, required: true, default: "home" },
    section: { type: String, required: true, default: "General" },
    label: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SiteContentSchema.index({ page: 1, section: 1, order: 1 });

const SiteContent = models.SiteContent || model<ISiteContent>("SiteContent", SiteContentSchema);

export default SiteContent;

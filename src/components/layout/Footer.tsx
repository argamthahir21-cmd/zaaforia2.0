"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ArrowRight,
} from "lucide-react";

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Dresses", href: "/shop?category=dresses" },
    { label: "Ethnic Wear", href: "/shop?category=ethnic-wear" },
    { label: "Western Wear", href: "/shop?category=western-wear" },
    { label: "Accessories", href: "/shop?category=accessories" },
    { label: "Sale", href: "/offers" },
  ],
  company: [
    { label: "About Zaaforia", href: "/about" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/about" },
    { label: "Press", href: "/about" },
  ],
  help: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping & Returns", href: "/faq" },
    { label: "Size Guide", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Track Order", href: "/orders" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

import { useCinemaStore } from "@/lib/store/useCinemaStore";
import { useContent } from "@/context/ContentContext";

export function Footer() {
  const { isIntroFinished } = useCinemaStore();
  const { getContent } = useContent();

  if (!isIntroFinished) return null;

  const tagline = getContent("footer.tagline", "Wear the Future. Own the Moment.");
  const description = getContent("footer.description", "Premium fashion destination for the modern woman. Curated collections of ethnic wear, western wear, and accessories.");

  return (
    <footer className="bg-[#FAFAF7] text-[#1A1A1A] relative">
      {/* Newsletter Section */}
      <div className="border-b border-[#E5E2DE]">
        <div className="max-w-[1400px] mx-auto px-6 py-14 md:py-16">
          <div className="max-w-lg mx-auto text-center">
            <p className="font-cormorant italic text-espresso text-lg mb-2">
              Stay Connected
            </p>
            <h3 className="font-cormorant text-3xl md:text-4xl text-[#1A1A1A] mb-3 font-light">
              Join the Zaaforia World
            </h3>
            <p className="text-sm text-espresso mb-7 font-jost tracking-wide">
              Subscribe for exclusive previews, styling tips, and early access
              to new collections.
            </p>
            <div className="flex gap-0 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Sign up for our weekly emails"
                className="flex-1 px-4 py-3 bg-white border border-[#E5E2DE] border-r-0 text-base font-jost text-[#1A1A1A] placeholder:text-[#C8BFB6] focus:outline-none focus:border-[#1A1A1A] transition-colors"
              />
              <button
                className="px-5 py-3 bg-[#1A1A1A] text-white flex items-center gap-1 hover:bg-[#2C2C2C] transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/">
              <h2 className="font-cormorant text-3xl font-semibold text-[#1A1A1A] tracking-[0.06em] mb-3">
                Z<span className="text-[#B8945F]">AA</span>FORIA
              </h2>
            </Link>
            <p className="text-sm text-[#1A1A1A] font-semibold font-jost mb-2 italic">
              {tagline}
            </p>
            <p className="text-sm text-espresso leading-relaxed mb-5 max-w-xs font-jost">
              {description}
            </p>
            <div className="space-y-2">
              <p className="text-sm text-espresso font-jost">hello@zaaforia.com</p>
              <p className="text-sm text-espresso font-jost">+91 98765 43210</p>
              <p className="text-sm text-espresso font-jost">Mumbai, India</p>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-jost text-sm font-medium text-[#1A1A1A] mb-4 uppercase tracking-[0.2em]">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-espresso hover:text-[#1A1A1A] transition-colors duration-300 font-jost"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-jost text-sm font-medium text-[#1A1A1A] mb-4 uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-espresso hover:text-[#1A1A1A] transition-colors duration-300 font-jost"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-jost text-sm font-medium text-[#1A1A1A] mb-4 uppercase tracking-[0.2em]">Help</h4>
            <ul className="space-y-2.5">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-espresso hover:text-[#1A1A1A] transition-colors duration-300 font-jost"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E5E2DE]">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-espresso font-jost tracking-wider">
            © 2026 Zaaforia. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-espresso hover:text-[#1A1A1A] transition-colors duration-300"
                aria-label={social.label}
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>

          {/* Payment badges */}
          <div className="flex items-center gap-2 text-[10px] text-[#C8BFB6] font-jost">
            <span className="px-2 py-1 border border-[#E5E2DE]">Visa</span>
            <span className="px-2 py-1 border border-[#E5E2DE]">Mastercard</span>
            <span className="px-2 py-1 border border-[#E5E2DE]">UPI</span>
            <span className="px-2 py-1 border border-[#E5E2DE]">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

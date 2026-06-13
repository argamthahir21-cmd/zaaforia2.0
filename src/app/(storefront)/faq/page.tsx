"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqSections = [
  {
    title: "Orders & Shipping",
    items: [
      { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days. Express delivery is available for 2-3 business days. International shipping may take 10-15 business days." },
      { q: "Is there free shipping?", a: "Yes! We offer free shipping on all orders above ₹2,999 within India." },
      { q: "Can I track my order?", a: "Absolutely! Once your order is shipped, you'll receive a tracking link via email and SMS." },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We offer a 15-day easy return policy. Items must be unworn, unwashed, and in original condition with tags attached." },
      { q: "How do I initiate a return?", a: "Log into your account, go to Orders, select the item, and click 'Return'. Our team will arrange a pickup." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 5-7 business days after we receive and inspect the returned item." },
    ],
  },
  {
    title: "Products & Sizing",
    items: [
      { q: "How do I find my size?", a: "Please refer to our detailed size guide on each product page. We recommend measuring yourself and comparing with our size chart for the best fit." },
      { q: "Are the colors accurate?", a: "We strive to display colors as accurately as possible. However, slight variations may occur due to screen settings." },
      { q: "Are your products authentic?", a: "100%. Every Zaaforia product is designed in-house and crafted with premium materials. We guarantee authenticity." },
    ],
  },
  {
    title: "Payment & Security",
    items: [
      { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, UPI, Net Banking, Wallets (Paytm, PhonePe), and Cash on Delivery." },
      { q: "Is my payment information secure?", a: "Yes, we use industry-standard SSL encryption. We never store your full card details on our servers." },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-[900px] mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <HelpCircle size={28} className="mx-auto mb-3 text-gold" />
          <h1 className="font-playfair text-5xl md:text-5xl text-espresso mb-4">Frequently Asked Questions</h1>
          <div className="luxury-divider" />
          <p className="font-poppins text-base text-espresso mt-4">Everything you need to know about shopping with Zaaforia.</p>
        </motion.div>

        <div className="space-y-10">
          {faqSections.map((section, si) => (
            <motion.div key={si} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: si * 0.1 }}>
              <h2 className="font-playfair text-2xl text-espresso mb-4">{section.title}</h2>
              <div className="bg-white rounded-xl shadow-card overflow-hidden divide-y divide-champagne/40">
                {section.items.map((item, qi) => {
                  const key = `${si}-${qi}`;
                  return (
                    <div key={qi}>
                      <button onClick={() => toggleItem(key)} className="w-full flex items-center justify-between p-5 text-left hover:bg-champagne/10 transition-colors">
                        <span className="font-poppins text-base font-medium text-espresso pr-4">{item.q}</span>
                        <ChevronDown size={16} className={`text-espresso transition-transform duration-300 flex-shrink-0 ${openItems[key] ? "rotate-180" : ""}`} />
                      </button>
                      <motion.div
                        initial={false}
                        animate={{ height: openItems[key] ? "auto" : 0, opacity: openItems[key] ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 font-poppins text-base text-espresso leading-relaxed">{item.a}</p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

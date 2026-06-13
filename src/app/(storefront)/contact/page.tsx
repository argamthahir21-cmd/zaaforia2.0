"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@zaaforia.com", link: "mailto:hello@zaaforia.com" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", link: "tel:+919876543210" },
  { icon: MapPin, label: "Address", value: "Mumbai, Maharashtra, India", link: "#" },
  { icon: Clock, label: "Hours", value: "Mon-Sat: 10am - 8pm IST", link: "#" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="font-cormorant italic text-gold text-xl mb-3">Get in Touch</p>
          <h1 className="font-playfair text-5xl md:text-5xl text-espresso mb-4">Contact Us</h1>
          <div className="luxury-divider" />
          <p className="font-poppins text-base text-espresso mt-4 max-w-md mx-auto">We&apos;d love to hear from you. Reach out with questions, suggestions, or just to say hello.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
            {contactInfo.map((info, i) => (
              <a key={i} href={info.link} className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow group">
                <div className="w-11 h-11 rounded-full bg-champagne/30 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/10 transition-colors">
                  <info.icon size={18} className="text-gold" />
                </div>
                <div>
                  <p className="font-poppins text-sm text-espresso tracking-widest uppercase mb-1">{info.label}</p>
                  <p className="font-poppins text-base text-espresso">{info.value}</p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-3">
            <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-xl p-8 shadow-card space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" placeholder="Your Name" className="w-full py-3.5 px-4 border border-champagne rounded-xl text-base font-poppins text-espresso placeholder:text-espresso focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all" />
                <input type="email" placeholder="Email Address" className="w-full py-3.5 px-4 border border-champagne rounded-xl text-base font-poppins text-espresso placeholder:text-espresso focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
              <input type="text" placeholder="Subject" className="w-full py-3.5 px-4 border border-champagne rounded-xl text-base font-poppins text-espresso placeholder:text-espresso focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all" />
              <textarea rows={5} placeholder="Your Message" className="w-full py-3.5 px-4 border border-champagne rounded-xl text-base font-poppins text-espresso placeholder:text-espresso focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all resize-none" />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                className="w-full py-4 bg-espresso text-white font-poppins text-base font-semibold tracking-[0.2em] uppercase rounded-xl flex items-center justify-center gap-3 hover:bg-gold hover:text-espresso transition-colors duration-300">
                Send Message <Send size={16} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

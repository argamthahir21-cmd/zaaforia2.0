"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  { id: "1", title: "The Art of Quiet Luxury: Dressing with Intention", excerpt: "Discover how minimalist elegance is redefining modern fashion.", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", category: "Style Guide", date: "Apr 28, 2026", readTime: "5 min read" },
  { id: "2", title: "Spring/Summer 2026: The Colors That Define This Season", excerpt: "From dusty rose to champagne gold — explore the palette of the season.", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80", category: "Trends", date: "Apr 20, 2026", readTime: "4 min read" },
  { id: "3", title: "Behind the Seams: Our Artisan Partners", excerpt: "Meet the skilled craftspeople who bring Zaaforia's vision to life.", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80", category: "Behind the Brand", date: "Apr 15, 2026", readTime: "6 min read" },
  { id: "4", title: "Ethnic Luxury: Reinventing Traditional Silhouettes", excerpt: "How contemporary design breathes new life into timeless ethnic wear.", image: "https://images.unsplash.com/photo-1583396082781-f0e97c25b3c8?w=800&q=80", category: "Fashion", date: "Apr 10, 2026", readTime: "5 min read" },
  { id: "5", title: "5 Ways to Style a Satin Blouse for Every Occasion", excerpt: "From boardroom to brunch — one piece, endless possibilities.", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", category: "Style Guide", date: "Apr 5, 2026", readTime: "3 min read" },
  { id: "6", title: "The Zaaforia Wedding Edit: Bridal Collection Preview", excerpt: "An exclusive first look at our upcoming bridal and celebration wear.", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80", category: "Collections", date: "Mar 28, 2026", readTime: "7 min read" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="font-cormorant italic text-gold text-xl mb-3">The Journal</p>
          <h1 className="font-playfair text-5xl md:text-5xl text-espresso mb-4">Fashion Editorial</h1>
          <div className="luxury-divider" />
          <p className="font-poppins text-base text-espresso mt-4 max-w-md mx-auto">Stories, trends, and inspiration from the world of Zaaforia.</p>
        </motion.div>

        {/* Featured Post */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
          <Link href="#" className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
            <div className="relative aspect-[16/10] lg:aspect-auto">
              <Image src={blogPosts[0].image} alt={blogPosts[0].title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="50vw" />
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="font-poppins text-sm text-gold tracking-[0.2em] uppercase mb-3">{blogPosts[0].category}</span>
              <h2 className="font-playfair text-3xl md:text-4xl text-espresso mb-4 group-hover:text-gold transition-colors">{blogPosts[0].title}</h2>
              <p className="font-poppins text-base text-espresso leading-relaxed mb-6">{blogPosts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm font-poppins text-espresso">
                <span className="flex items-center gap-1"><Calendar size={12} /> {blogPosts[0].date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {blogPosts[0].readTime}</span>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-poppins text-gold tracking-widest uppercase group-hover:gap-3 transition-all">
                Read Article <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href="#" className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
                <div className="relative aspect-[16/10]">
                  <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-poppins font-semibold text-gold tracking-widest uppercase">{post.category}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-xl text-espresso mb-2 group-hover:text-gold transition-colors line-clamp-2">{post.title}</h3>
                  <p className="font-poppins text-sm text-espresso leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-[10px] font-poppins text-espresso">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

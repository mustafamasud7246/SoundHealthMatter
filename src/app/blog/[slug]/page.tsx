"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, Share2, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { BLOGS } from "@/lib/blogs";

export default function BlogPost() {
  const { slug } = useParams();
  const blog = BLOGS.find(b => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <Link href="/blog" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 md:px-6">
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Link href="/blog" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex gap-3 mb-6">
            <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">{blog.category}</span>
            <span className="px-4 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3 h-3" /> {blog.readTime}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1]">{blog.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between border-y border-border py-6 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                {blog.author?.[0] || "A"}
              </div>
              <div>
                <p className="font-bold text-foreground leading-none mb-1">{blog.author || "Anonymous"}</p>
                <p className="text-sm text-secondary font-medium">Health Advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm font-bold text-secondary">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {blog.date}
              </div>
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl shadow-primary/10">
          <Image 
            src={blog.image} 
            alt={blog.title} 
            fill 
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-xl dark:prose-invert max-w-none">
          <p className="text-xl md:text-2xl leading-relaxed text-secondary font-medium mb-8">
            {blog.content}
          </p>
          <div className="p-8 bg-background border border-border rounded-3xl mb-12 italic text-lg leading-relaxed shadow-sm">
            "Your health is a long-term investment, not a short-term expense. Understanding the fundamental science behind your body's systems is the first step toward genuine optimization."
          </div>
          <p className="text-lg leading-relaxed text-secondary mb-8">
            At SoundHealthMatter, we believe that education is as important as tracking. By understanding the core drivers of your metabolic and cardiovascular health, you gain the power to make informed decisions that manifest in long-term vitality. Whether you are adjusting your macro-nutrients or fine-tuning your circadian rhythm, consistency remains the most potent tool in your wellness arsenal.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-border flex flex-col items-center text-center">
          <h4 className="text-2xl font-black mb-4">Enjoyed this article?</h4>
          <p className="text-secondary font-medium mb-8 max-w-md">Stay updated with our weekly digest of health-tech trends and expert wellness advice.</p>
          <div className="flex gap-4 w-full max-w-md">
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="flex-1 glass px-6 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
            />
            <button className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all">Subscribe</button>
          </div>
        </footer>
      </motion.article>
    </div>
  );
}

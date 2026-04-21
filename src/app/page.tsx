"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Activity, Heart, Brain, Moon, TrendingUp, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BLOGS } from "@/lib/blogs";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=2070&auto=format&fit=crop"
];

export default function Home() {
  const [currentImg, setCurrentImg] = useState(0);
  const [blogIdx, setBlogIdx] = useState(0);
  const highlightBlogs = BLOGS.slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);
    
    const blogTimer = setInterval(() => {
      setBlogIdx((prev) => (prev + 1) % highlightBlogs.length);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(blogTimer);
    };
  }, [highlightBlogs.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm text-primary mb-6 border-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              New: AI Health Assistant is now live
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-secondary">
              Your Smart <span className="text-transparent bg-clip-text bg-gradient-soft">Health Companion.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-secondary mb-10 max-w-2xl leading-relaxed">
              Global-level health-tech platform providing personalized wellness tracking, advanced tools, and premium health insights tailored for your life.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/dashboard" className="px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-[0_0_20px_var(--glow)] hover:scale-105 active:scale-95">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/tools" className="px-8 py-4 rounded-full glass font-semibold text-lg flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                Explore Tools
              </Link>
            </motion.div>
          </motion.div>

          {/* Abstract UI Elements */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            {/* REMOVED BOTTOM GRADIENT FOR FULL VISIBILITY */}
            <div className="glass rounded-2xl md:rounded-[2.5rem] border border-white/20 dark:border-white/10 p-1 md:p-2 shadow-2xl shadow-primary/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              {/* Dashboard Mockup Image Slider - 100% VISIBILITY */}
              <div className="aspect-[16/9] w-full rounded-xl md:rounded-[2rem] bg-secondary/10 flex items-center justify-center relative overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImg}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1.0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={HERO_IMAGES[currentImg]} 
                      alt={`Health Showcase ${currentImg}`} 
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* NO MORE DARKENING OVERLAYS HERE */}
                
                {/* Image Navigator Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {HERO_IMAGES.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentImg(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImg ? 'w-8 bg-primary shadow-[0_0_10px_var(--glow)]' : 'w-2 bg-white/30'}`}
                    />
                  ))}
                </div>
                
                {/* Floating Cards */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-10 left-10 md:top-20 md:left-20 glass p-4 rounded-2xl flex items-center gap-4 shadow-xl pointer-events-none z-20"
                >
                  <div className="bg-green-500/20 p-3 rounded-full text-green-500">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-medium">Daily Steps</p>
                    <p className="text-lg font-bold text-foreground">8,432</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 right-10 md:bottom-20 md:right-20 glass p-4 rounded-2xl flex items-center gap-4 shadow-xl pointer-events-none z-20"
                >
                  <div className="bg-purple-500/20 p-3 rounded-full text-purple-500">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-medium">Heart Rate</p>
                    <p className="text-lg font-bold text-foreground">72 bpm</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 bg-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Complete Health Ecosystem</h2>
            <p className="text-secondary max-w-2xl mx-auto">Everything you need to track, manage, and improve your health in one beautiful unified experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: "Smart Tracking", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Automated insights into your daily habits, calories, and routines.", href: "/dashboard" },
              { title: "Mental Wellness", icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Mindfulness exercises and daily check-ins for your mental health.", href: "/tools?tool=mental" },
              { title: "Sleep Analysis", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-500/10", desc: "Understand your sleep cycles and improve your recovery.", href: "/tools?tool=sleep" },
              { title: "Nutrition AI", icon: Activity, color: "text-green-500", bg: "bg-green-500/10", desc: "Personalized meal suggestions based on your body metrics.", href: "/tools?tool=calorie" },
              { title: "Heart Health", icon: Heart, color: "text-red-500", bg: "bg-red-500/10", desc: "Connect wearables for continuous cardiovascular monitoring.", href: "/tools?tool=heart" },
              { title: "Secure Data", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-500/10", desc: "Your health records are encrypted and totally private.", href: "/login" }
            ].map((feature, i) => (
              <Link href={feature.href} key={i} className="block group">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card/5 backdrop-blur-sm opacity-60 hover:opacity-100 border border-amber-900/20 dark:border-stone-700 shadow-sm shadow-amber-900/5 p-6 md:p-8 rounded-3xl h-full hover:bg-primary transition-all hover:shadow-[0_8px_30px_rgb(245,158,11,0.3)] hover:-translate-y-1 duration-300"
                >
                  <div className={`${feature.bg} ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-white transition-colors">{feature.title}</h3>
                  <p className="text-secondary group-hover:text-white/90 leading-relaxed font-medium transition-colors">{feature.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Highlights Slideshow */}
      <section className="py-24 overflow-hidden bg-background border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-4">Latest Insights</h2>
              <p className="text-secondary max-w-xl font-medium">Explore professional health advice, research-backed articles, and cutting-edge wellness tips.</p>
            </div>
            <Link href="/blog" className="px-6 py-3 rounded-xl border border-border font-bold hover:bg-secondary/5 transition-all flex items-center gap-2 group">
              View All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative group">
            <div className="overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] glass border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] group-hover:shadow-[0_40px_80px_-12px_rgba(245,158,11,0.25)] transition-all duration-700 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={blogIdx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="aspect-[4/5] md:aspect-[21/9] min-h-[450px] md:min-h-[400px] relative cursor-pointer"
                >
                  <Link href={`/blog/${highlightBlogs[blogIdx].slug}`} className="block w-full h-full relative group">
                    <Image 
                      src={highlightBlogs[blogIdx].image} 
                      alt={highlightBlogs[blogIdx].title} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-16">
                      <div className="max-w-2xl">
                        <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-lg mb-4 inline-block">
                          {highlightBlogs[blogIdx].category}
                        </span>
                        <h3 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight group-hover:text-primary transition-colors">
                          {highlightBlogs[blogIdx].title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-white/70 text-[10px] md:text-sm font-medium">
                          <span className="bg-white/10 px-2 py-0.5 rounded-md">{highlightBlogs[blogIdx].author}</span>
                          <span className="w-1 h-1 rounded-full bg-white/30 hidden md:block" />
                          <span className="flex items-center gap-1">
                             <Moon className="w-3 h-3" /> {highlightBlogs[blogIdx].readTime} read
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls - Hidden on very small screens, smaller on mobile */}
              <button 
                onClick={() => setBlogIdx(prev => (prev - 1 + highlightBlogs.length) % highlightBlogs.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-primary transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-20"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <button 
                onClick={() => setBlogIdx(prev => (prev + 1) % highlightBlogs.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-primary transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-20"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {highlightBlogs.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setBlogIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === blogIdx ? 'w-10 bg-primary' : 'w-2 bg-secondary/20 hover:bg-secondary/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

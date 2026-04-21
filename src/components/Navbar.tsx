"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Blog", href: "/blog" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 pointer-events-none mt-2 md:mt-4`}>
      <div className="container mx-auto px-4 md:px-6 z-50 relative pointer-events-auto">
        <div className={`px-6 py-3 rounded-3xl flex items-center justify-between transition-all duration-500 border border-amber-900/30 dark:border-stone-600 shadow-lg shadow-amber-900/10 dark:shadow-black/30 ${scrolled ? 'bg-card/90 backdrop-blur-xl' : 'bg-card/40 backdrop-blur-md'}`}>
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-soft p-2 rounded-xl text-white group-hover:shadow-[0_0_15px_var(--glow)] transition-all duration-300">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-primary group-hover:text-primary-dark transition-colors">
              SoundHealthMatter
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-stone-900 dark:bg-stone-950 p-1.5 rounded-full shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-bold transition-colors hover:text-primary ${
                    isActive ? "text-[#fefce8]" : "text-[#fbf1e3]/70"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-stone-700/60 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <Link 
              href="/login" 
              className="hidden sm:block px-5 py-2 rounded-full bg-foreground text-background font-medium text-sm hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              Sign In
            </Link>
            <button 
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
          
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0, scale: 0.95 }}
              animate={{ height: "auto", opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-3 bg-card/95 backdrop-blur-2xl border border-amber-900/10 dark:border-stone-600 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <nav className="flex flex-col p-4 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-4 rounded-2xl font-bold text-lg transition-colors ${
                      pathname === link.href 
                        ? "bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-white" 
                        : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 p-4 rounded-2xl font-bold bg-foreground text-background text-center shadow-lg"
                >
                  Sign In / Register
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

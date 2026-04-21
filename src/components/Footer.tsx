import Link from 'next/link';
import { Activity, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20 relative z-10 w-full">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="md:col-span-1 space-y-4 text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2 group inline-block">
              <div className="bg-gradient-soft p-1.5 rounded-lg text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-primary group-hover:text-primary-dark transition-colors">
                SoundHealthMatter
              </span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Your personalized AI-driven health and wellness companion. Track, analyze, and optimize your vitals in real-time.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <a href="#" className="text-secondary hover:text-primary transition-all hover:scale-110"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-secondary hover:text-primary transition-all hover:scale-110"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-secondary hover:text-primary transition-all hover:scale-110"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-secondary hover:text-primary transition-all hover:scale-110"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/dashboard" className="text-secondary hover:text-primary transition-colors">Smart Dashboard</Link></li>
              <li><Link href="/tools" className="text-secondary hover:text-primary transition-colors">Health Tools</Link></li>
              <li><Link href="/blog" className="text-secondary hover:text-primary transition-colors">Wellness Blog</Link></li>
              <li><Link href="#" className="text-secondary hover:text-primary transition-colors">Pricing Options</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-secondary hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-secondary hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-secondary hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="text-secondary hover:text-primary transition-colors">Press & Media</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold text-foreground mb-4">Legal Info</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-secondary hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-secondary hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-secondary hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-secondary hover:text-primary transition-colors">Data Security</Link></li>
            </ul>
          </div>
          
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} SoundHealthMatter. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm font-medium text-secondary">
            Made with <span className="text-red-500 animate-pulse">♥</span> for a healthier world.
          </div>
        </div>
      </div>
    </footer>
  );
}

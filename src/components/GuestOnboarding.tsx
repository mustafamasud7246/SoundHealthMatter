"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Ruler, Weight, Calendar, ArrowRight, Activity, X } from "lucide-react";

export default function GuestOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    height: "",
    weight: "",
    age: "",
    gender: "male"
  });

  const [heightUnit, setHeightUnit] = useState("cm");
  const [ft, setFt] = useState("");
  const [inch, setInch] = useState("");

  useEffect(() => {
    // Check if guest profile already exists in localStorage
    const savedProfile = localStorage.getItem("guest_profile");
    if (!savedProfile) {
      // Delay prompt by 2 seconds for better UX
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("guest_profile", JSON.stringify(formData));
    setIsOpen(false);
    // Reload page to reflect guest data in tools if needed
    window.location.reload();
  };

  const handleHeightChange = (val: string) => {
    setFormData({...formData, height: val});
  };

  const handleFtInChange = (f: string, i: string) => {
    setFt(f);
    setInch(i);
    if (f !== "" || i !== "") {
      const totalInches = (parseFloat(f || "0") * 12) + parseFloat(i || "0");
      const cm = (totalInches * 2.54).toFixed(1);
      setFormData({...formData, height: cm});
    }
  };

  const nextStep = () => setStep(prev => prev + 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-lg bg-card border border-amber-900/20 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-amber-900/10"
      >
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-10"
        >
          <X className="w-5 h-5 text-secondary" />
        </button>

        <div className="p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome Friend!</h2>
              <p className="text-secondary text-sm font-medium">Let's personalize your health journey.</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex gap-2 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-secondary/20'}`} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" /> What should we call you?
                    </label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your Name"
                      className="w-full bg-background/50 border border-border px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2">Gender</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['male', 'female'].map(g => (
                        <button
                          key={g}
                          onClick={() => setFormData({...formData, gender: g})}
                          className={`py-3 rounded-2xl border font-bold capitalize transition-all ${formData.gender === g ? 'border-primary bg-primary/5 text-primary' : 'border-border'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-secondary flex items-center gap-2">
                      <Ruler className="w-4 h-4" /> Your Height
                    </label>
                    <div className="flex bg-background/50 border border-border p-1 rounded-xl">
                      {['cm', 'in'].map(u => (
                        <button 
                          key={u} 
                          onClick={() => setHeightUnit(u)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${heightUnit === u ? 'bg-primary text-white' : 'text-secondary'}`}
                        >
                          {u.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {heightUnit === 'cm' ? (
                    <input 
                      type="number" 
                      value={formData.height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      placeholder="e.g. 175"
                      className="w-full bg-background/50 border border-border px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                    />
                  ) : (
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input 
                          type="number" 
                          value={ft}
                          onChange={(e) => handleFtInChange(e.target.value, inch)}
                          placeholder="Ft"
                          className="w-full bg-background/50 border border-border px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary text-xs font-bold">FT</span>
                      </div>
                      <div className="flex-1 relative">
                        <input 
                          type="number" 
                          value={inch}
                          onChange={(e) => handleFtInChange(ft, e.target.value)}
                          placeholder="In"
                          className="w-full bg-background/50 border border-border px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary text-xs font-bold">IN</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2 flex items-center gap-2">
                      <Weight className="w-4 h-4" /> Weight (kg)
                    </label>
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      placeholder="e.g. 70"
                      className="w-full bg-background/50 border border-border px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-bold text-secondary mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Current Age
                    </label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      placeholder="e.g. 25"
                      className="w-full bg-background/50 border border-border px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                    />
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                    <p className="text-xs text-secondary font-medium leading-relaxed italic">
                      This information helps us calculate your BMI, daily calorie needs, and ideal hydration levels instantly.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={step === 3 ? handleSave : nextStep}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            {step === 3 ? "Complete Profile" : "Continue"} <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 text-secondary text-sm font-medium hover:text-primary transition-colors"
          >
            I'll do this later
          </button>
        </div>
      </motion.div>
    </div>
  );
}

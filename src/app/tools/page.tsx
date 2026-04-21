"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Activity, Droplet, Moon, ChevronRight, Brain, HeartPulse, MousePointer2, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCursor, CursorStyle, CursorColor } from "@/context/CursorContext";

function ToolsContent() {
  const searchParams = useSearchParams();
  const { style, color, size, setStyle, setColor, setSize } = useCursor();
  const [activeTool, setActiveTool] = useState(searchParams.get("tool") || "bmi");
  
  useEffect(() => {
    const t = searchParams.get("tool");
    if (t) setActiveTool(t);

    // Load guest profile data if available
    const saved = localStorage.getItem("guest_profile");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.height) setHeight(data.height);
        if (data.weight) setWeight(data.weight);
        if (data.age) {
          setAge(data.age);
          setHeartAge(data.age);
        }
        if (data.gender) setGender(data.gender);
      } catch (e) {
        console.error("Error parsing guest profile", e);
      }
    }
  }, [searchParams]);

  // BMI State
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  
  // Calorie State
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("1.2");
  const [calories, setCalories] = useState<number | null>(null);

  // Hydration State
  const [workoutMin, setWorkoutMin] = useState("");
  const [waterAmount, setWaterAmount] = useState<number | null>(null);

  // Sleep State
  const [wakeHour, setWakeHour] = useState("7");
  const [wakeMinute, setWakeMinute] = useState("00");
  const [wakeAmPm, setWakeAmPm] = useState("AM");
  const [bedtimes, setBedtimes] = useState<string[]>([]);
  
  // Heart Rate State
  const [heartAge, setHeartAge] = useState("");
  const [zones, setZones] = useState<any>(null);

  // Macro Splitter State
  const [macroGoal, setMacroGoal] = useState("maintenance");
  const [macroResult, setMacroResult] = useState<any>(null);

  // Vision Timer State
  const [visionTime, setVisionTime] = useState(20);
  const [isVisionRunning, setIsVisionRunning] = useState(false);

  const getBmiStatus = (val: number) => {
    if (val < 18.5) return "Underweight";
    if (val < 25) return "Normal weight";
    if (val < 30) return "Overweight";
    return "Obese";
  };

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    if (height && weight) {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      setBmi(parseFloat((w / (h * h)).toFixed(1)));
    }
  };

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    if (age && height && weight) {
      const w = parseFloat(weight);
      const h = parseFloat(height);
      const a = parseInt(age);
      // Mifflin-St Jeor Equation
      let bmr = (10 * w) + (6.25 * h) - (5 * a);
      bmr = gender === "male" ? bmr + 5 : bmr - 161;
      setCalories(Math.round(bmr * parseFloat(activityLevel)));
    }
  };

  const calculateWater = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight) {
      // 35ml per kg of body weight, plus 500ml per hour of exercise
      const baseLiters = (parseFloat(weight) * 35) / 1000;
      const workoutLiters = (parseFloat(workoutMin || "0") / 60) * 0.5;
      setWaterAmount(parseFloat((baseLiters + workoutLiters).toFixed(1)));
    }
  };

  const calculateSleep = (e: React.FormEvent) => {
    e.preventDefault();
    if (wakeHour && wakeMinute) {
      let hours = parseInt(wakeHour);
      if (wakeAmPm === "PM" && hours !== 12) hours += 12;
      if (wakeAmPm === "AM" && hours === 12) hours = 0;
      
      const wakeDate = new Date();
      wakeDate.setHours(hours, parseInt(wakeMinute), 0, 0);
      
      const newBedtimes = [];
      // Calculate 3, 4, 5, and 6 cycles (90 mins each) + 15 min to fall asleep
      for (let i = 6; i >= 3; i--) {
        const bedTime = new Date(wakeDate.getTime() - (i * 90 * 60000) - (15 * 60000));
        newBedtimes.push(bedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
      setBedtimes(newBedtimes);
    }
  };

  const calculateHeartRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (heartAge) {
      const maxHr = 220 - parseInt(heartAge);
      setZones({
        max: maxHr,
        zone1: [Math.round(maxHr * 0.5), Math.round(maxHr * 0.6)], // Warm up
        zone2: [Math.round(maxHr * 0.6), Math.round(maxHr * 0.7)], // Fat burn
        zone3: [Math.round(maxHr * 0.7), Math.round(maxHr * 0.85)], // Cardio
      });
    }
  };

  const calculateMacros = (e: React.FormEvent) => {
    e.preventDefault();
    const cals = calories || 2000;
    let p, c, f;
    
    if (macroGoal === "cutting") {
      p = (cals * 0.4) / 4;
      c = (cals * 0.3) / 4;
      f = (cals * 0.3) / 9;
    } else if (macroGoal === "bulking") {
      p = (cals * 0.3) / 4;
      c = (cals * 0.5) / 4;
      f = (cals * 0.2) / 9;
    } else {
      p = (cals * 0.3) / 4;
      c = (cals * 0.4) / 4;
      f = (cals * 0.3) / 9;
    }
    
    setMacroResult({
      protein: Math.round(p),
      carbs: Math.round(c),
      fats: Math.round(f)
    });
  };

  useEffect(() => {
    let interval: any;
    if (isVisionRunning && visionTime > 0) {
      interval = setInterval(() => setVisionTime(v => v - 1), 1000);
    } else if (visionTime === 0) {
      setIsVisionRunning(false);
      // Play a subtle sound or notification here if possible
    }
    return () => clearInterval(interval);
  }, [isVisionRunning, visionTime]);

  const startVisionTimer = () => {
    setVisionTime(20);
    setIsVisionRunning(true);
  };

  // Mental Wellness State
  const [mentalStep, setMentalStep] = useState(0);
  const mentalSteps = [
    { title: "4-7-8 Breathing", desc: "Inhale for 4s, Hold for 7s, Exhale for 8s. Repeat 4 times to calm your nervous system.", icon: Brain, color: "text-purple-500", detail: "Step 1: Oxygenate" },
    { title: "Hydration Refresh", desc: "Drink 250ml of water slowly. Dehydration often mimics stress and fatigue.", icon: Droplet, color: "text-blue-500", detail: "Step 2: Fuel" },
    { title: "Posture Realignment", desc: "Roll your shoulders back and sit up straight for 2 minutes. Physical posture affects mental clarity.", icon: Activity, color: "text-green-500", detail: "Step 3: Strcuture" },
    { title: "Digital Sunlight", desc: "Look away from the screen at something 20 feet away for 20 seconds. Rest your cognitive load.", icon: Moon, color: "text-indigo-500", detail: "Step 4: Vision" },
    { title: "Gratitude Anchor", desc: "Think of one specific thing you achieved today, no matter how small. Acknowledge your effort.", icon: HeartPulse, color: "text-red-500", detail: "Step 5: Reward" }
  ];

  const tools = [
    { id: "bmi", title: "BMI Calculator", icon: Calculator, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "calorie", title: "Calorie Calculator", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: "water", title: "Hydration Tracker", icon: Droplet, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { id: "sleep", title: "Sleep Analyzer", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { id: "heart", title: "Heart Rate Zones", icon: HeartPulse, color: "text-red-500", bg: "bg-red-500/10" },
    { id: "macros", title: "Macro Splitter", icon: Calculator, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "vision", title: "Vision Guard", icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: "mental", title: "Mental Wellness", icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "cursor", title: "Cursor Studio", icon: MousePointer2, color: "text-pink-500", bg: "bg-pink-500/10" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 md:px-6 min-h-[90vh]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Smart Health <span className="text-transparent bg-clip-text bg-gradient-soft">Tools</span></h1>
          <p className="text-secondary text-lg">Calculate, track, and optimize your vital metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Sidebar Menu */}
          <div className="md:col-span-4 space-y-3">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all ${
                  activeTool === tool.id 
                    ? "glass border-primary/50 shadow-lg scale-[1.02]" 
                    : "glass hover:bg-slate-50 dark:hover:bg-slate-800/40 border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <div className={`${tool.bg} ${tool.color} p-3 rounded-xl`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 font-bold">{tool.title}</div>
                {activeTool === tool.id && <ChevronRight className="w-5 h-5 text-primary" />}
              </button>
            ))}
          </div>

          {/* Tool Container */}
          <div className="md:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="glass p-8 rounded-3xl min-h-[400px] border border-white/20 dark:border-white/10"
              >
                {/* --- BMI Calculator --- */}
                {activeTool === "bmi" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calculator className="text-blue-500" /> BMI Calculator</h2>
                    <form onSubmit={calculateBMI} className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-secondary mb-2">Height (cm)</label>
                        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" required placeholder="175" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-secondary mb-2">Weight (kg)</label>
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" required placeholder="70" />
                      </div>
                      <button type="submit" className="col-span-2 py-3 mt-4 rounded-xl bg-primary text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Calculate BMI</button>
                    </form>
                    {bmi !== null && (
                      <div className="mt-8 p-6 bg-background/50 rounded-2xl border border-primary/20 text-center animate-fade-in col-span-2">
                        <p className="text-secondary mb-2">Your Body Mass Index</p>
                        <p className="text-5xl font-extrabold mb-2">{bmi}</p>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                          getBmiStatus(bmi) === "Normal weight" ? "bg-green-500/20 text-green-500" : "bg-orange-500/20 text-orange-500"
                        }`}>{getBmiStatus(bmi)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Calorie Calculator --- */}
                {activeTool === "calorie" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Activity className="text-orange-500" /> Daily Calories (TDEE)</h2>
                    <form onSubmit={calculateCalories} className="grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-secondary mb-2">Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-secondary mb-2">Age</label>
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 outline-none" required placeholder="25" />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-secondary mb-2">Height (cm)</label>
                        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 outline-none" required placeholder="175" />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-secondary mb-2">Weight (kg)</label>
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 outline-none" required placeholder="70" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-secondary mb-2">Activity Level</label>
                        <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 outline-none">
                          <option value="1.2">Sedentary (office job)</option>
                          <option value="1.375">Light Exercise (1-2 days/week)</option>
                          <option value="1.55">Moderate Exercise (3-5 days/week)</option>
                          <option value="1.725">Heavy Exercise (6-7 days/week)</option>
                        </select>
                      </div>
                      <button type="submit" className="col-span-2 py-3 mt-2 rounded-xl bg-orange-500 text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Calculate Maintenance Calories</button>
                    </form>
                    {calories !== null && (
                      <div className="mt-6 p-6 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-center animate-fade-in">
                        <p className="text-secondary mb-1">To maintain your weight, you need:</p>
                        <p className="text-4xl font-extrabold text-foreground">{calories} <span className="text-lg font-normal text-secondary">kcal/day</span></p>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Water Tracker --- */}
                {activeTool === "water" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Droplet className="text-cyan-500" /> Hydration Goal</h2>
                    <form onSubmit={calculateWater} className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Weight (kg)</label>
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 outline-none" required placeholder="70" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Daily Exercise (minutes) - Optional</label>
                        <input type="number" value={workoutMin} onChange={(e) => setWorkoutMin(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 outline-none" placeholder="30" />
                      </div>
                      <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-cyan-500 text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Calculate Water Intake</button>
                    </form>
                    {waterAmount !== null && (
                      <div className="mt-6 p-6 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-center animate-fade-in">
                        <p className="text-secondary mb-1">Your recommended daily water intake is:</p>
                        <p className="text-4xl font-extrabold text-foreground">{waterAmount} <span className="text-lg font-normal text-secondary">Liters</span></p>
                        <p className="text-xs text-secondary mt-2">({Math.round(waterAmount * 4)} standard glasses of water)</p>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Sleep Analyzer --- */}
                {activeTool === "sleep" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Moon className="text-indigo-500" /> Sleep Cycle Analyzer</h2>
                    <p className="text-secondary text-sm mb-6">A good night's sleep consists of 5-6 complete sleep cycles. Waking up in the middle of a sleep cycle leaves you feeling groggy.</p>
                    <form onSubmit={calculateSleep} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">I want to wake up at:</label>
                        <div className="flex gap-3">
                          <select value={wakeHour} onChange={(e) => setWakeHour(e.target.value)} className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-3 outline-none font-bold text-center appearance-none cursor-pointer">
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                          <span className="flex items-center text-xl font-bold">:</span>
                          <select value={wakeMinute} onChange={(e) => setWakeMinute(e.target.value)} className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-3 outline-none font-bold text-center appearance-none cursor-pointer">
                            {["00","05","10","15","20","25","30","35","40","45","50","55"].map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <select value={wakeAmPm} onChange={(e) => setWakeAmPm(e.target.value)} className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-3 outline-none font-bold text-center appearance-none cursor-pointer">
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-indigo-500 text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Find Bedtimes</button>
                    </form>
                    {bedtimes.length > 0 && (
                      <div className="mt-6 animate-fade-in">
                        <p className="text-secondary text-center mb-4 text-sm font-medium">To wake up refreshed, head to bed at one of these times:</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {bedtimes.map((time, i) => (
                            <div key={i} className={`px-5 py-3 rounded-xl border font-bold ${i === 0 || i === 1 ? 'bg-indigo-500/20 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'bg-background/50 border-border'}`}>
                              {time}
                              <p className="text-[10px] font-normal opacity-70 text-center mt-1">
                                {6 - i} cycles
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-secondary text-center mt-4">*Times include 15 minutes to fall asleep.</p>
                      </div>
                    )}
                  </div>
                )}
                {/* --- Mental Wellness --- */}
                {activeTool === "mental" && (
                  <div className="h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Brain className="text-purple-500" /> Daily Mental Recharge</h2>
                    
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <AnimatePresence mode="wait">
                        {mentalStep < mentalSteps.length ? (
                          <motion.div 
                            key={mentalStep}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="bg-background/50 border border-border p-8 rounded-[2.5rem] w-full text-center relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                            
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                              {mentalSteps[mentalStep].detail}
                            </p>
                            
                            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 border-4 border-dashed animate-spin-slow ${mentalSteps[mentalStep].color.replace('text', 'border')}/20`}>
                              <div className={`${mentalSteps[mentalStep].color} bg-background p-5 rounded-full shadow-xl`}>
                                {React.createElement(mentalSteps[mentalStep].icon, { className: "w-8 h-8" })}
                              </div>
                            </div>
                            
                            <p className="text-secondary leading-relaxed mb-6 max-w-sm mx-auto font-medium">
                              {mentalSteps[mentalStep].desc.split('. ')[0]}.
                            </p>

                            {/* Proper Formatted Sub-steps */}
                            <div className="flex justify-center gap-3 mb-10">
                              {mentalStep === 0 ? (
                                <>
                                  <div className="bg-primary/5 border border-primary/20 px-3 py-2 rounded-xl text-xs font-black text-primary">INHALE 4s</div>
                                  <div className="bg-primary/5 border border-primary/20 px-3 py-2 rounded-xl text-xs font-black text-primary">HOLD 7s</div>
                                  <div className="bg-primary/5 border border-primary/20 px-3 py-2 rounded-xl text-xs font-black text-primary">EXHALE 8s</div>
                                </>
                              ) : (
                                <div className="bg-secondary/5 border border-border px-4 py-2 rounded-xl text-[10px] font-bold text-secondary uppercase tracking-widest leading-none">
                                  {mentalSteps[mentalStep].desc.split('. ')[1] || "Action Required"}
                                </div>
                              )}
                            </div>
                            
                            <button 
                              onClick={() => setMentalStep(prev => prev + 1)}
                              className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                              <CheckCircle2 className="w-5 h-5" /> Task Completed
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center p-10 bg-green-500/10 border border-green-500/20 rounded-[3rem]"
                          >
                             <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                               <CheckCircle2 className="w-10 h-10" />
                             </div>
                             <h3 className="text-3xl font-black mb-3">Recharge Complete!</h3>
                             <p className="text-secondary font-medium mb-8">You've successfully completed your daily mental wellness check-in. Your focus and clarity are now optimized.</p>
                             <button 
                               onClick={() => setMentalStep(0)}
                               className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:scale-105 transition-all"
                             >
                               Restart Routine
                             </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-8 flex justify-center gap-1.5">
                      {mentalSteps.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === mentalStep ? 'w-8 bg-primary' : i < mentalStep ? 'w-4 bg-green-500/50' : 'w-2 bg-secondary/20'}`} />
                      ))}
                    </div>
                  </div>
                )}

                {/* --- Heart Rate Zones --- */}
                {activeTool === "heart" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><HeartPulse className="text-red-500" /> Heart Rate Zones</h2>
                    <form onSubmit={calculateHeartRate} className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Age</label>
                        <input type="number" value={heartAge} onChange={(e) => setHeartAge(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 outline-none" required placeholder="30" />
                      </div>
                      <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-red-500 text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Calculate Targets</button>
                    </form>
                    {zones !== null && (
                      <div className="mt-6 flex flex-col gap-3 animate-fade-in">
                        <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 flex justify-between items-center">
                          <span className="font-bold text-red-700 dark:text-red-400">Maximum HR</span>
                          <span className="text-xl font-extrabold">{zones.max} <span className="text-sm font-normal">BPM</span></span>
                        </div>
                        <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex justify-between items-center">
                          <span className="font-bold text-amber-700 dark:text-amber-400">Cardio (70-85%)</span>
                          <span className="text-xl font-extrabold">{zones.zone3[0]} - {zones.zone3[1]}</span>
                        </div>
                        <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 flex justify-between items-center">
                          <span className="font-bold text-green-700 dark:text-green-400">Fat Burn (60-70%)</span>
                          <span className="text-xl font-extrabold">{zones.zone2[0]} - {zones.zone2[1]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Macro Splitter --- */}
                {activeTool === "macros" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calculator className="text-emerald-500" /> Macro Nutrient Splitter</h2>
                    <p className="text-secondary text-sm mb-6">Optimize your diet by splitting your calories into Protein, Carbs, and Fats based on your goal.</p>
                    <form onSubmit={calculateMacros} className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Target Daily Calories</label>
                        <input type="number" value={calories || 2000} onChange={(e) => setCalories(parseInt(e.target.value))} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 outline-none" required />
                        <p className="text-[10px] text-secondary mt-1 italic">*Defaulting to 2000 or your previous calorie calculation.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Body Goal</label>
                        <div className="grid grid-cols-3 gap-3">
                          {["cutting", "maintenance", "bulking"].map(g => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setMacroGoal(g)}
                              className={`py-3 rounded-xl border-2 transition-all font-bold text-xs capitalize ${
                                macroGoal === g ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-border bg-background/40'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-emerald-500 text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Split Macros</button>
                    </form>
                    {macroResult && (
                      <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in">
                        <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-center">
                          <p className="text-[10px] uppercase font-black text-blue-500 mb-1">Protein</p>
                          <p className="text-2xl font-black">{macroResult.protein}g</p>
                        </div>
                        <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-center">
                          <p className="text-[10px] uppercase font-black text-orange-500 mb-1">Carbs</p>
                          <p className="text-2xl font-black">{macroResult.carbs}g</p>
                        </div>
                        <div className="p-4 bg-pink-500/10 rounded-2xl border border-pink-500/20 text-center">
                          <p className="text-[10px] uppercase font-black text-pink-500 mb-1">Fats</p>
                          <p className="text-2xl font-black">{macroResult.fats}g</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Vision Guard --- */}
                {activeTool === "vision" && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2"><Activity className="text-amber-500" /> Vision Guard (20-20-20)</h2>
                    <p className="text-secondary text-sm mb-10 max-w-sm mx-auto font-medium">To reduce eye strain, every 20 minutes, look at something 20 feet away for 20 seconds.</p>
                    
                    <div className="relative w-48 h-48 mx-auto mb-10">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-border" />
                        <motion.circle 
                          cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" 
                          className="text-amber-500" 
                          strokeDasharray="552.92"
                          animate={{ strokeDashoffset: 552.92 * (1 - visionTime / 20) }}
                          transition={{ duration: isVisionRunning ? 1 : 0, ease: "linear" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-black tabular-nums">{visionTime}s</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {!isVisionRunning ? (
                        <button 
                          onClick={startVisionTimer}
                          className="px-10 py-4 bg-amber-500 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all w-full"
                        >
                          Start Rest Period
                        </button>
                      ) : (
                        <div className="p-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold rounded-2xl animate-pulse border border-amber-500/20">
                          Look 20ft away now...
                        </div>
                      )}
                      
                      {visionTime === 0 && !isVisionRunning && (
                        <p className="text-green-500 font-bold animate-bounce mt-4 flex items-center justify-center gap-2">
                           <CheckCircle2 className="w-5 h-5" /> Vision Restored!
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {/* --- Cursor Studio --- */}
                {activeTool === "cursor" && (
                  <div className="space-y-10">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold flex items-center gap-2"><MousePointer2 className="text-pink-500" /> Cursor Studio</h2>
                      <span className="px-3 py-1 bg-pink-500/10 text-pink-500 rounded-lg text-[10px] font-black uppercase">Global Sync Active</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <div>
                          <h3 className="font-bold mb-4 text-secondary uppercase text-xs tracking-widest">Pointer Reticle Style</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              onClick={() => setStyle("default")}
                              className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                                style === "default" ? 'border-primary bg-primary/5 shadow-lg' : 'border-border bg-background/40 hover:border-primary/30'
                              }`}
                            >
                              <span className="font-bold text-sm">Default</span>
                            </button>
                            <button
                              onClick={() => setStyle("none")}
                              className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                                style === "none" ? 'border-primary bg-primary/5 shadow-lg' : 'border-border bg-background/40 hover:border-primary/30'
                              }`}
                            >
                              <span className="font-bold text-sm">System</span>
                            </button>
                            <button
                              onClick={() => setStyle("classic")}
                              className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                                style === "classic" ? 'border-primary bg-primary/5 shadow-lg' : 'border-border bg-background/40'
                              }`}
                            >
                              <span className="font-bold text-sm">Classic</span>
                            </button>
                            {(["ring", "dot", "pulse", "aura", "fluid", "crosshair"] as CursorStyle[]).map((s) => (
                              <button
                                key={s}
                                onClick={() => setStyle(s)}
                                className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                                  style === s ? 'border-pink-500 bg-pink-500/5 shadow-lg' : 'border-border bg-background/40 hover:border-pink-500/30'
                                }`}
                              >
                                <span className="font-bold text-sm capitalize">{s}</span>
                                {(s === 'aura' || s === 'fluid') && <span className="px-1.5 py-0.5 bg-pink-500 text-white text-[8px] font-black rounded uppercase">Extra</span>}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold mb-4 text-secondary uppercase text-xs tracking-widest">Interactive Pointer Size</h3>
                          <div className="flex gap-4">
                            {[
                              { label: "Small", val: 16 },
                              { label: "Medium", val: 24 },
                              { label: "Large", val: 32 },
                              { label: "Epic", val: 48 }
                            ].map((sz) => (
                              <button
                                key={sz.val}
                                onClick={() => setSize(sz.val)}
                                className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-xs ${
                                  size === sz.val ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background/40 hover:border-primary/20'
                                }`}
                              >
                                {sz.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold mb-4 text-secondary uppercase text-xs tracking-widest">Interface Accent Color</h3>
                          <div className="flex flex-wrap gap-2.5">
                            {(["primary", "blue", "green", "purple", "white", "black", "red", "cyan"] as CursorColor[]).map((c) => (
                              <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 active:scale-90 ${color === c ? 'border-foreground shadow-xl' : 'border-transparent opacity-70'}`}
                                style={{ 
                                  backgroundColor: c === "primary" ? "#f59e0b" : c === "white" ? "#fff" : c === "black" ? "#000" : c 
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-background/50 border border-border rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent"></div>
                        <div className="relative z-10">
                          <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <MousePointer2 className="w-8 h-8 text-pink-500" />
                          </div>
                          <h4 className="text-xl font-black mb-2 italic">Hover to test</h4>
                          <p className="text-secondary text-sm font-medium">Your global interaction style has been updated. Try moving your cursor over this card to see the new {style} design in action.</p>
                        </div>
                        
                        {/* Interactive Elements for Testing */}
                        <div className="mt-8 flex gap-4 relative z-10 w-full">
                           <div className="flex-1 h-2 bg-pink-500/20 rounded-full overflow-hidden">
                              <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-1/2 h-full bg-pink-500" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center font-bold text-xl text-primary animate-pulse w-full">Loading health tools...</div>}>
      <ToolsContent />
    </Suspense>
  );
}

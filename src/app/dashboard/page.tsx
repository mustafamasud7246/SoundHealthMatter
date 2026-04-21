"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, Flame, Heart, Moon, Utensils, Zap, Settings, LogOut, CheckCircle2, ShieldCheck, X, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  
  // Onboarding Form State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [guestSteps, setGuestSteps] = useState(0);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [availableFood, setAvailableFood] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState("");

  // Modal States
  const [modalType, setModalType] = useState<"date" | "steps" | "reset" | null>(null);
  const [inputVal, setInputVal] = useState("");

  const foodInventory = [
    // Proteins
    "Eggs", "Chicken", "Salmon", "Beef", "Turkey", "Tofu", "Lentils", "Shrimp", "Tuna", "Greek Yogurt",
    // Carbs
    "Oats", "Rice", "Quinoa", "Potatoes", "Sweet Potatoes", "Pasta", "Bread", "Couscous", "Corn", "Buckwheat",
    // Veggies
    "Spinach", "Broccoli", "Carrots", "Cucumber", "Tomato", "Peppers", "Kale", "Asparagus", "Zucchini", "Cabbage",
    "Cauliflower", "Garlic", "Onions", "Mushroom", "Celery",
    // Fruits
    "Bananas", "Apples", "Berries", "Avocado", "Oranges", "Mango", "Grapes", "Pineapple", "Kiwi", "Lemon",
    // Fats & Others
    "Almonds", "Peanut Butter", "Honey", "Olive Oil", "Milk", "Walnuts", "Chia Seeds", "Flaxseeds", "Dark Chocolate"
  ];

  const FOOD_DATA: Record<string, { cal: number, pro: number, unit: string }> = {
    "Eggs": { cal: 155, pro: 13, unit: "g" },
    "Chicken": { cal: 165, pro: 31, unit: "g" },
    "Salmon": { cal: 208, pro: 20, unit: "g" },
    "Beef": { cal: 250, pro: 26, unit: "g" },
    "Turkey": { cal: 189, pro: 29, unit: "g" },
    "Tofu": { cal: 76, pro: 8, unit: "g" },
    "Lentils": { cal: 116, pro: 9, unit: "g" },
    "Shrimp": { cal: 99, pro: 24, unit: "g" },
    "Tuna": { cal: 132, pro: 28, unit: "g" },
    "Greek Yogurt": { cal: 59, pro: 10, unit: "g" },
    "Oats": { cal: 389, pro: 17, unit: "g" },
    "Rice": { cal: 130, pro: 2.7, unit: "g" },
    "Quinoa": { cal: 120, pro: 4.4, unit: "g" },
    "Potatoes": { cal: 77, pro: 2, unit: "g" },
    "Sweet Potatoes": { cal: 86, pro: 1.6, unit: "g" },
    "Pasta": { cal: 131, pro: 5, unit: "g" },
    "Bread": { cal: 265, pro: 9, unit: "g" },
    "Spinach": { cal: 23, pro: 2.9, unit: "g" },
    "Broccoli": { cal: 34, pro: 2.8, unit: "g" },
    "Bananas": { cal: 89, pro: 1.1, unit: "g" },
    "Apples": { cal: 52, pro: 0.3, unit: "g" },
    "Almonds": { cal: 579, pro: 21, unit: "g" },
    "Avocado": { cal: 160, pro: 2, unit: "g" },
    "Milk": { cal: 42, pro: 3.4, unit: "ml" }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      fetchProfile();
    } else {
      // Check for guest data
      const saved = localStorage.getItem("guest_profile");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setProfile(data);
          setIsGuest(true);
          setLoading(false);

          const savedSteps = localStorage.getItem("guest_steps");
          if (savedSteps) setGuestSteps(parseInt(savedSteps));

          const savedHistory = localStorage.getItem("guest_activity_log");
          if (savedHistory) {
            setActivityHistory(JSON.parse(savedHistory));
          } else {
            const mock = [
              { date: "April 15", steps: 6000 },
              { date: "April 16", steps: 3000 },
              { date: "April 17", steps: 8250 },
              { date: "April 18", steps: 4500 },
              { date: "April 19", steps: 6750 },
              { date: "April 20", steps: 1500 },
              { date: "April 21", steps: 0 },
            ];
            setActivityHistory(mock);
            localStorage.setItem("guest_activity_log", JSON.stringify(mock));
          }

          const savedImg = localStorage.getItem("guest_img");
          if (savedImg) setProfileImage(savedImg);

          const savedInventory = localStorage.getItem("guest_inventory");
          if (savedInventory) setAvailableFood(JSON.parse(savedInventory));

          let d = localStorage.getItem("guest_date");
          if (!d) {
            setModalType("date");
          } else {
            setCurrentDate(d);
          }
        } catch (e) {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (!data.height || !data.weight || !data.age) {
          setShowOnboarding(true);
        }
      }
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        localStorage.setItem("guest_img", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFood = (item: string) => {
    const updated = availableFood.includes(item) 
      ? availableFood.filter(f => f !== item) 
      : [...availableFood, item];
    setAvailableFood(updated);
    localStorage.setItem("guest_inventory", JSON.stringify(updated));
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          height: Number(height), 
          weight: Number(weight), 
          age: Number(age), 
          gender 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setShowOnboarding(false);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const addSteps = (amount: number, dateStr: string = currentDate) => {
    if (dateStr === currentDate) {
       const newTotal = guestSteps + amount;
       setGuestSteps(newTotal);
       localStorage.setItem("guest_steps", newTotal.toString());
    }
    
    setActivityHistory(prev => {
      const existing = prev.find(item => item.date === dateStr);
      let newHistory;
      if (existing) {
        newHistory = prev.map(item => item.date === dateStr ? { ...item, steps: item.steps + amount } : item);
      } else {
        newHistory = [...prev, { date: dateStr, steps: amount }];
      }
      localStorage.setItem("guest_activity_log", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleModalSubmit = () => {
    if (modalType === "date") {
      setCurrentDate(inputVal);
      localStorage.setItem("guest_date", inputVal);
    } else if (modalType === "steps") {
      const val = parseInt(inputVal);
      if (!isNaN(val)) addSteps(val);
    } else if (modalType === "reset") {
      localStorage.removeItem("guest_profile");
      localStorage.removeItem("guest_inventory");
      localStorage.removeItem("guest_steps");
      localStorage.removeItem("guest_activity_log");
      localStorage.removeItem("guest_date");
      localStorage.removeItem("guest_img");
      window.location.href = "/";
    }
    setModalType(null);
    setInputVal("");
  };

  if (loading || status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // --- RENDERING ONBOARDING MODAL ---
  if (showOnboarding) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-[80vh]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass max-w-lg w-full p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-soft"></div>
          <h2 className="text-3xl font-extrabold mb-2">Welcome, {session?.user?.name}!</h2>
          <p className="text-secondary mb-6">Before we personalize your dashboard, we need a few biometric details to calculate your specific health metrics.</p>
          
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-secondary pl-1">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-secondary pl-1">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-secondary pl-1">Height (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-secondary pl-1">Weight (kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2" required />
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 mt-8 rounded-xl bg-primary text-white font-bold shadow-[0_0_20px_var(--glow)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Initialize Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- RENDERING REAL DASHBOARD ---
  const bmiValue = profile?.weight && profile?.height ? (profile.weight / Math.pow(profile.height / 100, 2)) : 0;
  const bmiCalc = bmiValue > 0 ? bmiValue.toFixed(1) : "N/A";

  const getBmiAdvice = () => {
    if (bmiValue === 0) return { status: "Unknown", advice: "Please enter your info", goal: "Balance" };
    if (bmiValue < 18.5) return { status: "Underweight", advice: "You should focus on gaining lean muscle mass.", goal: "Weight Gain", color: "text-blue-500" };
    if (bmiValue < 25) return { status: "Normal", advice: "Your weight is optimal. Maintain your current lifestyle.", goal: "Maintenance", color: "text-green-500" };
    if (bmiValue < 30) return { status: "Overweight", advice: "Consider a mild calorie deficit and increased activity.", goal: "Weight Loss", color: "text-amber-500" };
    return { status: "Obese", advice: "Professional dietary guidance for weight reduction is recommended.", goal: "Weight Loss", color: "text-red-500" };
  };

  const bmiAdvice = getBmiAdvice();

  const dietPlan = (() => {
    const proteins = availableFood.filter(f => ["Chicken", "Salmon", "Beef", "Turkey", "Tofu", "Lentils", "Shrimp", "Tuna", "Eggs", "Greek Yogurt"].includes(f));
    const carbs = availableFood.filter(f => ["Oats", "Rice", "Quinoa", "Potatoes", "Sweet Potatoes", "Pasta", "Bread", "Couscous", "Corn", "Buckwheat"].includes(f));
    const veggies = availableFood.filter(f => ["Spinach", "Broccoli", "Carrots", "Cucumber", "Tomato", "Peppers", "Kale", "Asparagus", "Zucchini", "Cabbage", "Cauliflower", "Garlic", "Onions", "Mushroom", "Celery"].includes(f));
    const fruits = availableFood.filter(f => ["Bananas", "Apples", "Berries", "Avocado", "Oranges", "Mango", "Grapes", "Pineapple", "Kiwi", "Lemon"].includes(f));
    
    let goal: 'gain' | 'lose' | 'maintain' = 'maintain';
    if (bmiValue < 18.5) goal = 'gain';
    else if (bmiValue >= 25) goal = 'lose';

    const pick = (list: string[], pool: string[]) => {
      const available = list.filter(item => pool.includes(item));
      if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const getNutri = (food: string, weight: number) => {
      const base = FOOD_DATA[food] || { cal: 50, pro: 1 };
      return {
        cal: Math.round((base.cal * weight) / 100),
        pro: Math.round(((base.pro || 0) * weight) / 100)
      };
    };

    const meals = [
      { type: "Breakfast", main: pick(carbs, availableFood), side: pick(fruits, availableFood), baseQty: goal === 'gain' ? 150 : 100 },
      { type: "Lunch", main: pick(proteins, availableFood), side: pick(veggies, availableFood), baseQty: goal === 'lose' ? 120 : 180 },
      { type: "Snack", main: pick(availableFood, availableFood), side: null, baseQty: 50 },
      { type: "Dinner", main: pick(proteins, availableFood), side: pick(carbs, availableFood), baseQty: goal === 'gain' ? 200 : 150 }
    ];

    return meals.map(m => {
      const mainNutri = getNutri(m.main, m.baseQty);
      const sideNutri = m.side ? getNutri(m.side, 50) : { cal: 0, pro: 0 };
      return {
        meal: m.type,
        food: m.side ? `${m.main} & ${m.side}` : m.main,
        qty: `${m.baseQty}g`,
        cal: mainNutri.cal + sideNutri.cal,
        pro: mainNutri.pro + sideNutri.pro
      };
    });
  })();

  let targetCalories = 2000;
  if (profile?.weight && profile?.height && profile?.age) {
    let bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age);
    bmr = profile.gender === "male" ? bmr + 5 : bmr - 161;
    targetCalories = Math.round(bmr * 1.2);
  }

  const currentSteps = isGuest ? guestSteps : (profile?.steps || 0);

  const getWellnessAdvice = () => {
    if (currentSteps < 3000) return { title: "Stay Active", advice: "You're a bit sedentary today. Try taking a 10-minute walk.", action: "Take a Walk", diet: "Focus on light snacks like almonds." };
    else if (currentSteps < 7000) return { title: "Building Momentum", advice: "Good progress! Drink 2 more glasses of water.", action: "Drink Water", diet: "Ensure balanced protein & veggies." };
    else return { title: "Power Achiever", advice: "Excellent activity levels! Warm bath now helps recovery.", action: "Take a Bath", diet: "Replenish with complex carbs." };
  };

  const advice = getWellnessAdvice();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 relative">
      
      {/* --- CUSTOM MODALS --- */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               onClick={() => modalType !== 'date' && setModalType(null)}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative glass max-w-md w-full p-8 rounded-[2.5rem] shadow-2xl border border-white/20"
             >
                <div className="flex items-center gap-4 mb-6">
                   <div className="bg-primary/20 p-3 rounded-2xl text-primary">
                      {modalType === 'date' ? <Calendar /> : modalType === 'steps' ? <Zap /> : <Settings />}
                   </div>
                   <h3 className="text-2xl font-black">
                      {modalType === 'date' ? "Current Date" : modalType === 'steps' ? "Log Steps" : "Reset Everything?"}
                   </h3>
                </div>

                {modalType !== 'reset' ? (
                  <div className="space-y-4">
                    <p className="text-secondary font-medium">
                      {modalType === 'date' ? "Please set today's date to track your daily progress." : `How many steps did you walk on ${currentDate}?`}
                    </p>
                    <input 
                      autoFocus
                      type={modalType === 'date' ? "text" : "number"}
                      placeholder={modalType === 'date' ? "e.g., April 21" : "e.g., 1200"}
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleModalSubmit()}
                      className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold text-lg"
                    />
                  </div>
                ) : (
                  <p className="text-secondary font-medium leading-relaxed">
                    This will permanently clear your profile, pantry, and history. You cannot undo this action.
                  </p>
                )}

                <div className="flex gap-3 mt-8">
                   <button 
                     onClick={handleModalSubmit}
                     className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                   >
                     {modalType === 'reset' ? "YES, RESET" : "CONFIRM"}
                   </button>
                   {modalType !== 'date' && (
                     <button 
                       onClick={() => setModalType(null)}
                       className="px-6 py-4 bg-secondary/10 font-bold rounded-2xl hover:bg-secondary/20 transition-all text-secondary"
                     >
                       CANCEL
                     </button>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar/Profile Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-80 flex flex-col gap-6">
          <div className="glass p-6 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-soft opacity-20"></div>
            <div className="relative w-28 h-28 mx-auto mt-4 mb-4 group cursor-pointer">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/50 dark:border-slate-800 shadow-[0_0_20px_var(--glow)] flex items-center justify-center bg-white dark:bg-slate-800">
                {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-primary">{isGuest ? "G" : session?.user?.name?.charAt(0).toUpperCase()}</span>}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-xs font-bold pointer-events-none">CHANGE</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <h2 className="text-xl font-bold">{isGuest ? profile?.name || "Guest User" : session?.user?.name}</h2>
            <p className="text-sm text-secondary mb-6">{isGuest ? "Not Logged In" : session?.user?.email}</p>
            <div className="grid grid-cols-2 gap-4 text-left border-t border-white/10 dark:border-white/5 pt-6">
              <div><p className="text-xs text-secondary mb-1">Weight</p><p className="font-bold text-lg">{profile?.weight} <span className="text-sm font-normal text-secondary">kg</span></p></div>
              <div><p className="text-xs text-secondary mb-1">Height</p><p className="font-bold text-lg">{profile?.height} <span className="text-sm font-normal text-secondary">cm</span></p></div>
              <div><p className="text-xs text-secondary mb-1">BMI</p><p className="font-bold text-lg text-primary">{bmiCalc}</p></div>
              <div><p className="text-xs text-secondary mb-1">Age</p><p className="font-bold text-lg">{profile?.age} <span className="text-sm font-normal text-secondary">yrs</span></p></div>
            </div>
          </div>
          <div className="glass p-4 rounded-3xl flex flex-col gap-2">
             <button className="flex items-center gap-3 w-full p-3 bg-secondary/10 text-primary font-medium rounded-2xl transition-colors"><Activity className="w-5 h-5" /> Overview</button>
            <button onClick={() => setModalType("reset")} className="flex items-center gap-3 w-full p-3 hover:bg-secondary/10 font-medium rounded-2xl transition-colors text-secondary hover:text-foreground"><Settings className="w-5 h-5" /> Reset Profile Data</button>
            {isGuest ? (
              <button onClick={() => router.push("/login")} className="flex items-center gap-3 w-full p-3 bg-primary text-white font-bold rounded-2xl transition-colors mt-4"><LogOut className="w-5 h-5" /> Login to Save</button>
            ) : (
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center gap-3 w-full p-3 hover:bg-red-500/10 font-medium rounded-2xl transition-colors text-red-500 mt-4"><LogOut className="w-5 h-5" /> Sign Out</button>
            )}
          </div>
        </motion.div>

        {/* Main Dashboard Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold mb-1">{isGuest ? `Hey, ${profile?.name || "Guest"}` : "Welcome back."}</h1>
              <p className="text-secondary tracking-tight">Today's Date: <span className="text-primary font-bold">{currentDate}</span></p>
            </div>
            {isGuest ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Viewing as Guest</p>
                <Link href="/login" className="ml-2 text-xs bg-amber-500 text-white px-2 py-1 rounded-lg hover:scale-105 transition-all">Save Data</Link>
              </div>
            ) : (
              <button className="px-5 py-2 glass rounded-full text-sm font-bold shadow-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Cloud Synced</button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "Daily Steps", value: currentSteps.toLocaleString(), goal: "10,000", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", percent: `${Math.min(((currentSteps || 0)/10000)*100, 100)}%` },
              { title: "TDEE Calories", value: targetCalories, goal: "kcal/day", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", percent: "100%" },
              { title: "Resting Heart", value: "68", goal: "bpm avg", icon: Heart, color: "text-red-500", bg: "bg-red-500/10", percent: "100%" },
              { title: "Sleep Log", value: "7h 15m", goal: "8h goal", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-500/10", percent: "90%" }
            ].map((stat, i) => (
              <div key={i} className="glass p-5 rounded-3xl relative overflow-hidden group">
                <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-full flex items-center justify-center mb-4`}><stat.icon className="w-5 h-5" /></div>
                <p className="text-sm font-medium text-secondary mb-1">{stat.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.title === "Daily Steps" && (
                    <button onClick={() => addSteps(500)} className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-xs font-bold">+</button>
                  )}
                </div>
                <p className="text-xs text-secondary/70">/ {stat.goal}</p>
                <div className="mt-4 w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <div className={`h-full ${stat.bg.replace('/10', '')} ${stat.color.replace('text-', 'bg-')}`} style={{ width: stat.percent }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[2rem] border border-primary/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
               <div className="flex items-center gap-3 mb-6"><div className="bg-primary/20 p-3 rounded-2xl text-primary"><Activity className="w-6 h-6" /></div><h3 className="text-xl font-bold">Priority Wellness Advice</h3></div>
               <div className="space-y-6">
                 <div><h4 className="text-primary font-bold text-sm mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{advice.title}</h4><p className="text-foreground leading-relaxed font-medium">{advice.advice}</p></div>
                 <div className="p-4 bg-secondary/5 rounded-2xl border border-border"><h4 className="text-secondary font-bold text-xs mb-1 uppercase tracking-wider">Suggested Diet/Habit</h4><p className="text-sm font-medium opacity-90">{advice.diet}</p></div>
                 <button onClick={() => setModalType("steps")} className="w-full py-3 bg-foreground text-background rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">I've done this! (Log Action)</button>
               </div>
            </div>

            <div className="glass p-8 rounded-[2rem] border border-border flex flex-col justify-center">
               <div className="flex items-center justify-between mb-8"><h3 className="text-xl font-bold">Dietary Status</h3><span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-bold">Healthy Range</span></div>
               <div className="space-y-6">
                 <div className="flex justify-between items-center p-4 bg-background/50 rounded-2xl border border-border"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><Utensils className="w-5 h-5" /></div><span className="font-bold">Water Intake</span></div><span className="text-primary font-bold">2.4 / 3.5 L</span></div>
                 <div className="flex justify-between items-center p-4 bg-background/50 rounded-2xl border border-border"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500"><Flame className="w-5 h-5" /></div><span className="font-bold">Sugar Limit</span></div><span className="text-orange-500 font-bold">12 / 25 g</span></div>
               </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-border overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
               <div><h3 className="text-xl font-bold">Personalized Nutritional Strategy</h3><p className="text-secondary text-sm">A specific blueprint created for your **{bmiAdvice.status}** status.</p></div>
               <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`px-5 py-2 rounded-2xl ${bmiAdvice.color?.replace('text', 'bg')}/10 border border-border flex items-center gap-3 shadow-lg shadow-black/5`}>
                  <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className={`w-3 h-3 rounded-full ${bmiAdvice.color?.replace('text', 'bg')}`} />
                  <span className={`text-sm font-black uppercase tracking-widest ${bmiAdvice.color}`}>Goal: {bmiAdvice.goal}</span>
               </motion.div>
            </div>
            <div className="mb-8">
              <h4 className="text-xs font-bold text-secondary uppercase mb-3 flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Select Available Food Items (Pantry Inventory)</h4>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 border border-border rounded-2xl bg-secondary/5 custom-scrollbar">
                {foodInventory.map(item => (
                  <motion.button key={item} onClick={() => toggleFood(item)} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className={`px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-bold transition-all border ${availableFood.includes(item) ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-background/80 border-border text-secondary hover:border-primary/50'}`}>{item}</motion.button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
               <motion.div whileHover={{ scale: 1.02 }} className="bg-background/50 p-6 rounded-[1.5rem] border border-border relative overflow-hidden group shadow-inner">
                  <div className={`absolute -right-4 -top-4 w-20 h-20 ${bmiAdvice.color?.replace('text', 'bg')}/10 rounded-full blur-xl`} /><p className="text-xs text-secondary font-bold uppercase mb-2 relative z-10">Current Status</p>
                  <motion.p animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 3 }} className={`text-3xl font-black ${bmiAdvice.color} relative z-10`}>{bmiAdvice.status}</motion.p>
               </motion.div>
               <div className="md:col-span-2 bg-primary/5 p-6 rounded-[1.5rem] border border-primary/10 flex items-center gap-4">
                 <div className="bg-primary/20 p-3 rounded-xl text-primary">
                   <Activity className="w-6 h-6" />
                 </div>
                 <p className={`font-medium ${bmiAdvice.status === 'Underweight' ? 'ringlight-text text-xl font-black' : 'text-foreground/90'}`}>
                   {bmiAdvice.advice}
                 </p>
               </div>
            </div>
            {availableFood.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-4 px-4 text-[10px] font-black text-secondary uppercase tracking-widest">Meal Type</th>
                      <th className="py-4 px-4 text-[10px] font-black text-secondary uppercase tracking-widest">Recommended Plate</th>
                      <th className="py-4 px-4 text-[10px] font-black text-secondary uppercase tracking-widest">Portion (g)</th>
                      <th className="py-4 px-4 text-[10px] font-black text-secondary uppercase tracking-widest">Calories</th>
                      <th className="py-4 px-4 text-[10px] font-black text-secondary uppercase tracking-widest">Protein</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dietPlan.map((item, idx) => (
                      <tr key={idx} className="border-b border-border/50 group hover:bg-primary/5 transition-colors">
                        <td className="py-5 px-4 font-bold text-primary">{item.meal}</td>
                        <td className="py-5 px-4 font-medium text-foreground/80">{item.food}</td>
                        <td className="py-5 px-4 font-black text-secondary/80">{item.qty}</td>
                        <td className="py-5 px-4">
                          <span className="bg-orange-500/10 text-orange-600 px-2 py-1 rounded-lg font-bold text-xs">
                            {item.cal} kcal
                          </span>
                        </td>
                        <td className="py-5 px-4">
                          <span className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded-lg font-bold text-xs">
                            {item.pro}g Protein
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-center"><div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 animate-bounce"><Utensils className="w-8 h-8" /></div><h4 className="text-xl font-bold mb-2">Pantry is Empty!</h4><p className="text-secondary max-w-sm">Please select the food items you have available in the section above to generate your personalized nutritional plan.</p></div>
            )}
          </div>

          <div className="glass p-6 md:p-8 rounded-3xl w-full">
            <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold flex items-center gap-2"><Utensils className="text-primary"/> Daily Activity Timeline</h3><p className="text-xs text-secondary font-bold">Last 7 Days</p></div>
            <div className="flex gap-4">
              <div className="flex flex-col justify-between text-[10px] text-secondary font-bold py-2 h-48 md:h-64 border-r border-border pr-2">{[15000, 12000, 10000, 8000, 4000, 3000, 2000, 1000, 0].map(val => (<span key={val}>{val.toLocaleString()}</span>))}</div>
              <div className="h-48 md:h-64 relative flex-1">
                <svg className="absolute inset-x-0 top-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.path d={`M ${activityHistory.slice(-7).map((h, i) => `${(i / 6) * 100} ${100 - Math.min((h.steps / 15000) * 100, 95)}`).join(' L ')}`} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/40" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                  {activityHistory.slice(-7).map((h, i) => (<motion.circle key={i} cx={(i / 6) * 100} cy={100 - Math.min((h.steps / 15000) * 100, 95)} r="1" className="fill-primary" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} />))}
                </svg>
                <div className="absolute inset-0 flex items-end justify-between gap-1 px-1">
                  {activityHistory.slice(-7).map((h, i) => (
                    <div key={i} className="w-full h-full flex flex-col items-center justify-end gap-2 group">
                      <div className="w-full bg-slate-900/30 dark:bg-slate-100/30 border-x border-t border-slate-900/30 dark:border-white/10 rounded-t-sm relative hover:bg-primary/20 transition-all group-hover:shadow-[0_0_15px_var(--glow)]" style={{ height: `${Math.min((h.steps / 15000) * 100, 100)}%` }}>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 font-bold shadow-xl">{h.steps.toLocaleString()} steps</div>
                      </div>
                      <span className="text-[7px] md:text-[9px] text-secondary font-bold uppercase tracking-tighter mt-1 truncate max-w-full">{h.date.split(' ').slice(1).join('/') || h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-border">
            <h3 className="text-xl font-bold mb-6">Activity History Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-border"><th className="py-4 px-4 text-xs font-bold text-secondary uppercase">Date</th><th className="py-4 px-4 text-xs font-bold text-secondary uppercase">Total Steps</th><th className="py-4 px-4 text-xs font-bold text-secondary uppercase">Goal Achieved</th></tr></thead>
                <tbody>{activityHistory.slice().reverse().map((log, idx) => (<tr key={idx} className="border-b border-border/50 hover:bg-primary/5 transition-colors"><td className="py-4 px-4 font-bold">{log.date}</td><td className="py-4 px-4 font-medium text-primary">{log.steps.toLocaleString()}</td><td className="py-4 px-4"><span className={`px-2 py-1 rounded-md text-[10px] font-bold ${log.steps >= 10000 ? 'bg-green-500/20 text-green-500' : 'bg-secondary/10 text-secondary'}`}>{log.steps >= 10000 ? "GOAL HIT" : `${Math.round((log.steps/10000)*100)}%`}</span></td></tr>))}</tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

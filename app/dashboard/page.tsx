"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const BADGE_DEFS: Record<string, { title: string; icon: string; gradient: string }> = {
  level_1: { title: "First Steps", icon: "directions_walk", gradient: "from-[#00693e] to-[#91f8b8]" },
  level_2: { title: "Time Traveler", icon: "history", gradient: "from-[#005ea0] to-[#66affe]" },
  level_3: { title: "Fortune Teller", icon: "auto_awesome", gradient: "from-[#6D28D9] to-[#C084FC]" },
  level_4: { title: "Architect", icon: "construction", gradient: "from-[#B45309] to-[#FCD34D]" },
  level_5: { title: "Master Orator", icon: "military_tech", gradient: "from-[#DC2626] to-[#F87171]" },
};

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const { user, signOut } = useAuth();
  const email = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Learner";
  const avatarUrl = user?.user_metadata?.custom_avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_badges")
      .select("badge_key")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setEarnedBadges(data?.map((b: any) => b.badge_key) || []);
      });
  }, [user, supabase]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-[#f5f6ff] z-50">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tight text-[#005ea0] font-headline">GrammarJourney</span>
          <div className="hidden md:flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full">
            <span className="text-sm font-semibold text-primary font-headline">Level 0: Getting Started</span>
            <div className="w-32 h-2 bg-outline-variant/20 rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[0%] relative">
                <div className="absolute right-0 top-0 h-full w-1 bg-white/30"></div>
              </div>
            </div>
            <span className="text-xs font-bold text-on-surface-variant">0%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">emoji_events</span>
          </button>
          <button title="Sign Out" onClick={handleSignOut} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">logout</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-primary-container overflow-hidden">
            {avatarUrl ? (
              <img alt="User Avatar" className="w-full h-full object-cover" loading="lazy" src={avatarUrl}/>
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            )}
          </div>
        </div>
      </nav>

      {/* SideNavBar (Desktop Only) */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 py-8 space-y-4 backdrop-blur-xl bg-white/80 w-64 rounded-r-[3rem] border-r border-[#9aadd6]/15 shadow-[40px_0_60px_-15px_rgba(26,46,80,0.06)] z-40 mt-16">
        <div className="px-8 mb-6">
          <h3 className="font-headline font-bold text-on-surface text-lg">{email}</h3>
          <p className="text-xs text-on-surface-variant">Level 0: Beginner</p>
        </div>
        <div className="px-4 mb-4">
          <button onClick={() => router.push("/practice")} className="w-full py-4 bg-secondary text-on-secondary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 hover:scale-105 transition-transform active:scale-95">
            <span className="material-symbols-outlined">bolt</span>
            Daily Challenge
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          <button onClick={() => router.push("/dashboard")} className="bg-gradient-to-r from-[#005ea0] to-[#66affe] text-white rounded-full mx-2 my-1 px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined">home</span>
            <span className="font-headline font-semibold">Home</span>
          </button>
          <button onClick={() => router.push("/learning-map")} className="text-[#1a2e50] px-4 py-3 mx-2 flex items-center gap-3 hover:bg-[#d7e2ff]/50 rounded-full transition-all">
            <span className="material-symbols-outlined">map</span>
            <span className="font-headline font-semibold">Journey Map</span>
          </button>
          <button onClick={() => router.push("/history")} className="text-[#1a2e50] px-4 py-3 mx-2 flex items-center gap-3 hover:bg-[#d7e2ff]/50 rounded-full transition-all">
            <span className="material-symbols-outlined">history</span>
            <span className="font-headline font-semibold">History</span>
          </button>
          <button onClick={() => router.push("/profile")} className="text-[#1a2e50] px-4 py-3 mx-2 flex items-center gap-3 hover:bg-[#d7e2ff]/50 rounded-full transition-all">
            <span className="material-symbols-outlined">person</span>
            <span className="font-headline font-semibold">Profile</span>
          </button>
        </nav>

      </aside>

      {/* Main Content Canvas */}
      <main className="lg:ml-64 pt-24 px-6 pb-12 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Welcome Section */}
          <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-container-lowest to-surface-container-low shadow-sm">
            <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-xl text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface">Welcome back, {email}!</h1>
                <p className="text-lg text-on-surface-variant font-body">You&apos;re making incredible progress in the <b>Present Tense</b> module. Ready to bridge the gap to level 2 today?</p>
                <button onClick={() => router.push("/practice")} className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold text-lg shadow-[0_10px_30px_-5px_rgba(0,94,160,0.3)] hover:scale-105 transition-transform">
                  Continue Your Journey
                </button>
              </motion.div>
              <div className="relative w-full md:w-1/3 aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-secondary-container/20 rounded-full blur-3xl"></div>
                <img alt="Learning" className="relative z-10 w-full h-auto drop-shadow-2xl" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_GMepy38w7mWs_Ofh6J-n3vYp77C7D4dYlaza4X1tRaRxgHRWCFK2O6MfQ2nrOMcsEMxW3kUFQReODfJWDmA58kIR_ESXg2V2Fnr_miEzsXC7QmPMMGH6bEiTlWHdqrWavoMcX6c-wn0Q3u6B1ZKSA1c1QBa7IaKOVxi2s4XBV00RWkdTTcKG38jvmiZj0Dypd12hUZ4XtZaun6E-5QRmfSyFg0e5BL32iGN4PvgLtD6L_ocTh-03xyfRNeIhu4UVeg72bQFpZa4g"/>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </section>

          {/* Stats Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface-container-lowest p-8 rounded-lg flex flex-col items-center justify-center text-center space-y-2 border-b-4 border-primary">
              <span className="text-primary-dim text-sm font-bold font-headline uppercase tracking-widest">Communication Score</span>
              <div className="text-6xl font-headline font-extrabold text-on-surface">0</div>
                +0% this week
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-surface-container-lowest p-8 rounded-lg flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-on-surface-variant text-sm font-bold font-headline">Lessons Completed</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-secondary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="251.2" strokeWidth="8"></circle>
                </svg>
                <span className="absolute text-xl font-extrabold">0<span className="text-on-surface-variant/50 text-sm">/50</span></span>
              </div>
              <p className="text-xs text-on-surface-variant italic">The journey is just beginning</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-secondary to-on-secondary-container p-8 rounded-lg flex flex-col items-center justify-center text-center text-on-secondary space-y-2">
              <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
              <div className="text-5xl font-headline font-extrabold">0 Days</div>
              <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Current Streak</span>
            </motion.div>
          </section>

          {/* Badges Showcase */}
          {earnedBadges.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                Recent Badges
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {earnedBadges.map(key => {
                  const badge = BADGE_DEFS[key];
                  if (!badge) return null;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex items-center gap-3 px-6 py-4 bg-gradient-to-r ${badge.gradient} text-white rounded-xl shadow-lg shrink-0`}
                    >
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{badge.icon}</span>
                      <span className="font-headline font-bold">{badge.title}</span>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Analysis & Next Goal Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-lg space-y-8">
              <h2 className="text-2xl font-headline font-bold text-on-surface">Proficiency Analysis</h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-secondary font-headline">Strengths: Simple Sentences</label>
                    <span className="text-xs font-bold text-on-surface-variant">Mastered</span>
                  </div>
                  <div className="w-full h-3 bg-secondary-container/30 rounded-full">
                    <div className="h-full bg-secondary rounded-full w-[0%] relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-error font-headline">Weaknesses: Asking Questions</label>
                    <span className="text-xs font-bold text-on-surface-variant">Focus Area</span>
                  </div>
                  <div className="w-full h-3 bg-error-container/10 rounded-full">
                    <div className="h-full bg-error rounded-full w-[0%]"></div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-outline-variant/10">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  <span className="font-bold text-primary">Tip:</span>{" "}
                  Try the &quot;Question Master&quot; drill today to improve your inquiry skills.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-surface-container p-8 flex flex-col justify-between">
              <div className="relative z-10">
                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">NEXT GOAL</span>
                <h2 className="mt-4 text-3xl font-headline font-bold text-on-surface">Level 1: Daily Actions</h2>
                <p className="mt-4 text-on-surface-variant max-w-xs">Master how to describe your everyday routine using standard present tense verbs.</p>
              </div>
              <div className="mt-8 relative z-10 flex items-center justify-between">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-4 border-surface-container bg-primary-container text-on-primary-container text-[10px] font-bold flex items-center justify-center">+14k</div>
                </div>
                <button onClick={() => router.push("/practice")} className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                  Unlock Lesson <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
              <span className="absolute -right-8 -bottom-8 material-symbols-outlined text-[12rem] text-primary/5 select-none pointer-events-none">auto_stories</span>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md flex justify-around items-center py-4 px-2 border-t border-outline-variant/10 z-50">
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => router.push("/learning-map")} className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px] font-bold">Map</span>
        </button>
        <button onClick={() => router.push("/history")} className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">history</span>
          <span className="text-[10px] font-bold">History</span>
        </button>
        <button onClick={() => router.push("/profile")} className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LearningMap() {
  const router = useRouter();

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* TopAppBar Navigation */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-[#f5f6ff] z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="text-2xl font-bold tracking-tight text-[#005ea0] font-headline">GrammarJourney</button>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => router.push("/dashboard")} className="font-headline text-sm font-medium text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity duration-200 py-1">Home</button>
          <button onClick={() => router.push("/learning-map")} className="font-headline text-sm font-bold text-[#005ea0] border-b-2 border-[#005ea0] py-1">Journey Map</button>
          <button onClick={() => router.push("/history")} className="font-headline text-sm font-medium text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity duration-200 py-1">History</button>
          <button onClick={() => router.push("/profile")} className="font-headline text-sm font-medium text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity duration-200 py-1">Profile</button>
        </nav>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary">notifications</span>
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary">emoji_events</span>
          </button>
          <img alt="User profile" className="w-10 h-10 rounded-full border-2 border-primary-container shadow-sm" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9kbDdjX6Zg-5dOFnbwUS4I3JPtbz7ejxeALeCFreLuicGQybjG3ATJu2oAyTPFRJBeeTRG7Gk8Qm1bIHoYEwVvBXA9h19puo8ABy07wZ7zl9ya9JbyNA--na4YQRovq6ZRwG981wAvYHfs_xfmteOFi_fYu40_HYPrtnLrlok-UxHvFZ-RwcdzNQ6VrcrQL-tBKQexZQxedDcRntz9SZMerlt_zr8G0TUVbtOadZ6qdnZP5-aMn6QjhA6XS6cx1cHGX9jqew4-4IZ"/>
        </div>
      </header>

      {/* SideNavBar (Desktop Only) */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 py-8 space-y-4 backdrop-blur-xl bg-white/80 w-64 rounded-r-[3rem] border-r border-[#9aadd6]/15 shadow-[40px_0_60px_-15px_rgba(26,46,80,0.06)] z-40 mt-16">
        <div className="px-8 mb-8">
          <h2 className="font-headline font-semibold text-[#1a2e50] text-lg">English Learner</h2>
          <p className="text-xs text-on-surface-variant opacity-70 leading-relaxed font-body">Level 0: Beginner</p>
        </div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => router.push("/dashboard")} className="w-full flex items-center gap-4 text-[#1a2e50] px-4 py-3 mx-2 hover:bg-[#d7e2ff]/50 rounded-full transition-all">
            <span className="material-symbols-outlined">home</span>
            <span className="font-headline font-semibold">Home</span>
          </button>
          <button onClick={() => router.push("/learning-map")} className="w-full flex items-center gap-4 bg-gradient-to-r from-[#005ea0] to-[#66affe] text-white rounded-full mx-2 my-1 px-4 py-3 Active: translate-x-1 duration-200">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
            <span className="font-headline font-semibold">Journey Map</span>
          </button>
          <button onClick={() => router.push("/history")} className="w-full flex items-center gap-4 text-[#1a2e50] px-4 py-3 mx-2 hover:bg-[#d7e2ff]/50 rounded-full transition-all">
            <span className="material-symbols-outlined">history</span>
            <span className="font-headline font-semibold">History</span>
          </button>
          <button onClick={() => router.push("/profile")} className="w-full flex items-center gap-4 text-[#1a2e50] px-4 py-3 mx-2 hover:bg-[#d7e2ff]/50 rounded-full transition-all">
            <span className="material-symbols-outlined">person</span>
            <span className="font-headline font-semibold">Profile</span>
          </button>
        </nav>
        <div className="px-4 mt-auto">
          <button onClick={() => router.push("/practice")} className="w-full py-4 px-6 bg-secondary text-on-secondary rounded-xl font-headline font-bold text-sm shadow-lg shadow-secondary/20 transition-transform active:scale-95">
            Start Daily Challenge
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="min-h-screen pt-24 pb-12 lg:pl-72 lg:pr-12 px-6">
        {/* Hero Context */}
        <div className="max-w-4xl mx-auto mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full text-primary font-headline font-bold text-xs uppercase tracking-wider mb-4 backdrop-blur-md border border-white/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            In Progress: Getting Started
          </div>
          <h1 className="text-4xl lg:text-6xl font-headline font-extrabold text-on-surface leading-tight tracking-tight mb-4">
            The Narrative <span className="text-primary italic">Path</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed font-body">
            Unlock the secrets of English grammar as you journey through the pastoral landscape of language mastery.
          </p>
        </div>

        {/* The Journey Map Area */}
        <div className="relative max-w-4xl mx-auto py-20 overflow-visible">
          {/* SVG Path Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 1400">
            <path 
              className="fill-none stroke-outline-variant/40 stroke-[4]" 
              strokeDasharray="12 12" 
              d="M 400 50 C 650 150, 650 350, 400 450 C 150 550, 150 750, 400 850 C 650 950, 650 1150, 400 1250"
            />
          </svg>

          {/* Map Nodes Container */}
          <div className="relative z-10 flex flex-col items-center gap-40">
            {/* Level 1: Active Node */}
            <div className="relative group">
              <div className="absolute -left-32 -top-8 w-24 h-24 opacity-80 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-secondary opacity-40">nature</span>
              </div>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-[0_0_40px_rgba(0,94,160,0.3)] ring-4 ring-white z-20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </motion.div>
              <div className="absolute top-1/2 left-32 -translate-y-1/2 w-48 p-4 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/10">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1 font-headline">Level 1</p>
                <h3 className="font-headline font-bold text-on-surface">Present Tense</h3>
                <p className="text-xs text-on-surface-variant mt-1 italic font-body">The Basics</p>
              </div>
              <button onClick={() => router.push("/practice")} className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-6 py-2 rounded-full font-headline font-bold text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-2 z-30">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                Start Level
              </button>
            </div>

            {/* Level 2: Locked */}
            <div className="relative ml-80 group opacity-60 grayscale-[0.5]">
              <div className="absolute -right-24 -top-4 opacity-50">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant">school</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-surface-dim flex items-center justify-center border-4 border-white shadow-inner">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
              </div>
              <div className="absolute top-1/2 right-28 -translate-y-1/2 w-40 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-dashed border-outline-variant/20 text-right">
                <p className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest mb-1 font-headline">Level 2</p>
                <h3 className="font-headline font-bold text-on-surface opacity-50">Past Tense</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-body">Yesterday</p>
              </div>
            </div>

            {/* Level 3: Locked */}
            <div className="relative mr-80 group opacity-60 grayscale-[0.5]">
              <div className="absolute -left-20 top-2 opacity-50">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant">store</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-surface-dim flex items-center justify-center border-4 border-white shadow-inner">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
              </div>
              <div className="absolute top-1/2 left-24 -translate-y-1/2 w-40 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-dashed border-outline-variant/20">
                <p className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest font-headline">Level 3</p>
                <h3 className="font-headline font-bold text-on-surface opacity-50">Future Plans</h3>
              </div>
            </div>

            {/* Additional Locked Nodes (Simplified for brevity as per prototype) */}
            <div className="relative ml-40 group opacity-40 grayscale">
               <div className="w-16 h-16 rounded-full bg-surface-dim flex items-center justify-center border-4 border-white">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
              </div>
              <div className="absolute top-1/2 left-24 -translate-y-1/2 w-40 p-3">
                <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase font-headline">Level 4</p>
                <h3 className="font-headline font-bold text-on-surface opacity-50">Building Blocks</h3>
              </div>
            </div>
            
            {/* ... etc */}
          </div>
        </div>

        {/* Progress Summary Bento Section */}
        <section className="max-w-4xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-headline font-bold text-2xl text-on-surface mb-2">Overall Proficiency</h4>
              <p className="text-on-surface-variant font-body mb-6">You've mastered 0% of the core grammar curriculum. Keep going!</p>
              <div className="w-full h-4 bg-secondary-container rounded-full overflow-hidden mb-2">
                <div className="h-full bg-secondary w-[0%] relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs font-bold text-secondary font-headline">
                <span>A1: BEGINNER</span>
                <span>C2: FLUENT</span>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12">
              <span className="material-symbols-outlined text-[12rem] text-primary">insights</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-tertiary to-tertiary-dim p-8 rounded-lg text-white shadow-xl shadow-tertiary/20 flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-3xl mb-4">tips_and_updates</span>
              <h4 className="font-headline font-bold text-xl mb-2">Grammar Tip</h4>
              <p className="text-sm opacity-80 leading-relaxed font-light font-body">The present continuous is for actions happening right now. Don't forget your 'ing'!</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest mt-6 flex items-center gap-2 hover:translate-x-1 transition-transform font-headline">
              Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="w-full flex flex-col items-center gap-6 px-8 mt-20 py-12 bg-[#f5f6ff] border-t border-[#9aadd6]/10">
        <p className="font-body text-xs text-[#1a2e50]/60 text-center">© 2024 GrammarJourney. The Modern Pastoral Learning Path.</p>
      </footer>
    </div>
  );
}

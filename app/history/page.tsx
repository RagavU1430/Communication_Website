"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

import { useAuth } from "@/components/AuthProvider";

export default function History() {
  const router = useRouter();
  const { user } = useAuth();
  const userEmail = user?.email ?? "Learner";

  return (
    <div className="bg-background text-on-background font-body min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-[#f5f6ff] z-50">
        <div className="flex items-center gap-8">
          <button onClick={() => router.push("/dashboard")} className="text-2xl font-bold tracking-tight text-[#005ea0]">GrammarJourney</button>
          <div className="hidden md:flex gap-6 font-headline text-sm font-medium">
            <button onClick={() => router.push("/dashboard")} className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity">Home</button>
            <button onClick={() => router.push("/learning-map")} className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity">Journey Map</button>
            <button className="text-[#005ea0] font-bold border-b-2 border-[#005ea0]">History</button>
            <button onClick={() => router.push("/profile")} className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity">Profile</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">notifications</span>
          <div className="w-10 h-10 rounded-full border-2 border-primary-fixed overflow-hidden">
            <img alt="User profile" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZBHsHpsLWqxC5PvQGjyo8lvpK5cCVG_hl-_SrL1mdfXtjQHf7pp4smGkUYHjlRFEV2mHZ0XvuPhZyZ482WP3FmbKcEmgfUDv0b6FxXoC4s5wuF_GKY_IddA-cIfiTPKTkGTXn7PyTZTH4eGe0Mjvp8_ajQ0TLuB4eirEkkBrHJALWBSBxXFM-lZndUg9gJMn265b3KBXJ1a3LUK-NPTUiyH5COaZcT4psBc_J2oeqYxWI7vwa5M6zN8I6lZJ-lJkSb1xvKEfgosTO"/>
          </div>
        </div>
      </nav>

      {/* SideNavBar (Desktop Only) */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 py-8 space-y-4 backdrop-blur-xl bg-white/80 w-64 rounded-r-[3rem] border-r border-[#9aadd6]/15 shadow-[40px_0_60px_-15px_rgba(26,46,80,0.06)] z-40 mt-16">
        <div className="px-8 mb-8">
          <h2 className="font-headline font-bold text-lg text-primary">English Learner</h2>
          <p className="text-xs text-on-surface-variant">Level 1: Beginner</p>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => router.push("/dashboard")} className="w-full text-[#1a2e50] px-4 py-3 mx-2 flex items-center gap-3 hover:bg-[#d7e2ff]/50 rounded-full transition-all font-headline font-semibold">
            <span className="material-symbols-outlined">home</span> Home
          </button>
          <button onClick={() => router.push("/learning-map")} className="w-full text-[#1a2e50] px-4 py-3 mx-2 flex items-center gap-3 hover:bg-[#d7e2ff]/50 rounded-full transition-all font-headline font-semibold">
            <span className="material-symbols-outlined">map</span> Journey Map
          </button>
          <button className="w-full bg-gradient-to-r from-[#005ea0] to-[#66affe] text-white rounded-full mx-2 my-1 px-4 py-3 flex items-center gap-3 font-headline font-semibold">
            <span className="material-symbols-outlined">history</span> History
          </button>
          <button onClick={() => router.push("/profile")} className="w-full text-[#1a2e50] px-4 py-3 mx-2 flex items-center gap-3 hover:bg-[#d7e2ff]/50 rounded-full transition-all font-headline font-semibold">
            <span className="material-symbols-outlined">person</span> Profile
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-24 pb-12 lg:ml-64 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Learning History</h1>
          <p className="text-on-surface-variant font-body italic opacity-70 tracking-wide">Relive your milestones and track your growth through the Narrative Path.</p>
        </header>

        <section className="space-y-6">
          <div className="bg-surface-container-low p-12 rounded-2xl text-center border-2 border-dashed border-outline-variant/20">
            <div className="w-20 h-20 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">history_edu</span>
            </div>
            <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">Your Story is Just Beginning</h2>
            <p className="text-on-surface-variant max-w-md mx-auto font-body">As you complete lessons and master levels, they will appear here in your personal learning log.</p>
            <button onClick={() => router.push("/learning-map")} className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-headline font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              Start Your First Lesson
            </button>
          </div>
        </section>
      </main>

      <footer className="w-full flex flex-col items-center gap-6 px-8 mt-20 border-t border-[#9aadd6]/10 py-12">
        <p className="text-xs font-body text-[#1a2e50]/60 text-center">
            © 2024 GrammarJourney. The Modern Pastoral Learning Path.
        </p>
      </footer>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RoleplayScenario() {
  const router = useRouter();
  const [response, setResponse] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  return (
    <div className="bg-background font-body text-on-background selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-[#f5f6ff] z-50">
        <div className="flex items-center gap-8">
          <button onClick={() => router.push("/dashboard")} className="text-2xl font-bold tracking-tight text-[#005ea0] font-headline">GrammarJourney</button>
          <div className="hidden md:flex items-center gap-6 font-headline text-sm font-medium">
            <button onClick={() => router.push("/dashboard")} className="text-[#005ea0] font-bold border-b-2 border-[#005ea0] transition-opacity duration-200">Home</button>
            <button onClick={() => router.push("/learning-map")} className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity duration-200">Journey Map</button>
            <button onClick={() => router.push("/history")} className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity duration-200">History</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#005ea0] hover:bg-surface-container-low rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-[#005ea0] hover:bg-surface-container-low rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined">emoji_events</span>
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden cursor-pointer" onClick={() => router.push("/profile")}>
            <img alt="User profile" className="w-full h-full object-cover" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHRmTiuIruKlBIk2LYabF-gpsMnljQtPiT1In58mwnlI27TFHaZXeUfWOa_-eaZ3MlwpXZtVwU1M4Opk2Wxn1RqoNKR6SglpI1Oz6y5S1zBwboAwbRdAsXkQji0Z39C7tMU3ShAzRUqpXwotTScW1zCQjJM1Yexv-JrB-zjdtJrMRnUlse9zfiXmrCO64wufO_0aeQ_ev4pjc7Ky8xIh2tlastaG9bCecbZAVa7WtkQnbNsb7N3ABuSSuHOv08XPhh2C1SFlIi2nEH"/>
          </div>
        </div>
      </nav>

      {/* SideNavBar (Hidden on Mobile) */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 py-8 space-y-4 backdrop-blur-xl bg-white/80 border-r border-[#9aadd6]/15 w-64 rounded-r-[3rem] z-40 shadow-[40px_0_60px_-15px_rgba(26,46,80,0.06)] mt-16 font-headline">
        <div className="px-8 mb-6">
          <p className="font-bold text-on-surface">English Learner</p>
          <p className="text-xs text-on-surface-variant font-body leading-relaxed">Level 1: Beginner</p>
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={() => router.push("/dashboard")} className="text-[#1a2e50] px-4 py-3 mx-2 hover:bg-[#d7e2ff]/50 transition-all rounded-full flex items-center gap-3 text-left">
            <span className="material-symbols-outlined">home</span> Home
          </button>
          <button onClick={() => router.push("/learning-map")} className="bg-linear-to-r from-[#005ea0] to-[#66affe] text-white rounded-full mx-2 my-1 px-4 py-3 flex items-center gap-3 active:translate-x-1 duration-200 shadow-md">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>map</span> Journey Map
          </button>
          <button onClick={() => router.push("/history")} className="text-[#1a2e50] px-4 py-3 mx-2 hover:bg-[#d7e2ff]/50 transition-all rounded-full flex items-center gap-3 text-left">
            <span className="material-symbols-outlined">history</span> History
          </button>
          <button onClick={() => router.push("/profile")} className="text-[#1a2e50] px-4 py-3 mx-2 hover:bg-[#d7e2ff]/50 transition-all rounded-full flex items-center gap-3 text-left">
            <span className="material-symbols-outlined">person</span> Profile
          </button>
        </div>
        <div className="mt-auto px-4">
          <button onClick={() => router.push("/practice")} className="w-full bg-secondary-container text-on-secondary-container font-bold py-4 rounded-xl hover:bg-secondary transition-colors shadow-sm">
            Start Daily Challenge
          </button>
        </div>
      </aside>

      <main className="pt-24 pb-12 px-6 lg:pl-72 max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-primary font-headline font-semibold mb-2">
            <span className="material-symbols-outlined text-lg">school</span>
            <span className="tracking-wide text-xs uppercase">SCENARIO MODULE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface font-headline tracking-tight">Level 1: Talking to a Teacher</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full h-[400px] rounded-lg overflow-hidden group shadow-md"
            >
              <img alt="Teacher and student" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2xkPxJsPE2ckT343e_UnzBYxpOGPyGO-XOmdOZQyQGN8Mt7mVKQYLxvjk9PnoiStzM8f9hTDEHMpsBxvcGnbXndfj4ykxg0iGcQDhRd3eQI7lJUghioZfxbB4N7IBJlBsgsApP4D0c2IT8CW_4yXcIfIFNBWzgwCpKs50nbiocHbqAinTOiPFVgopy2TCGXiZF8Uew47O2d_yCjNAcFML7gVJWpMfle5n_V8YUsajYNIpEKmO6G9yDXtXWC-uBtvlhSW5Au-PA6C1"/>
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/80 backdrop-blur-md text-xs font-bold mb-3 uppercase tracking-widest font-headline">Active Scenario</span>
                <h2 className="text-2xl font-headline font-bold">Roleplay: Introduction</h2>
                <p className="text-white/90 text-lg font-body">You are meeting your new teacher for the first time.</p>
              </div>
            </motion.div>

            <div className="bg-surface-container-lowest rounded-lg p-8 border border-outline-variant/15 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">chat_bubble</span>
                </div>
                <div>
                  <h3 className="text-xl font-headline font-bold text-on-surface">What would you say to introduce yourself?</h3>
                  <p className="text-on-surface-variant font-body">Type your response below to practice formal greetings.</p>
                </div>
              </div>
              <textarea 
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full h-40 bg-surface-container-low border-none rounded-lg p-6 font-body text-lg focus:ring-2 focus:ring-primary-container transition-all resize-none placeholder:text-on-surface-variant/40 outline-none shadow-inner" 
                placeholder="Type your introduction here..."
              ></textarea>
              <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-secondary-container/30 border border-secondary/20 rounded-full">
                  <span className="material-symbols-outlined text-secondary text-sm">lightbulb</span>
                  <span className="text-xs font-semibold text-on-secondary-container font-headline italic">Try starting with "Hello, my name is..."</span>
                </div>
                <button 
                  onClick={() => setHasSubmitted(true)}
                  className="w-full md:w-auto px-10 py-4 bg-linear-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-headline"
                >
                  Submit Intro
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {hasSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-surface-container-lowest rounded-lg p-8 border-l-4 border-primary shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <h3 className="text-xl font-headline font-bold text-on-surface">Feedback Received</h3>
                  </div>
                  <p className="text-on-surface leading-relaxed mb-4">
                    "Excellent introduction! Your use of formal greetings is spot on. For an even more natural sound, you might try adding a polite 'Nice to meet you' at the end."
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary-container/20 rounded-full text-xs font-bold text-primary">
                      Grammar: 10/10
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-secondary-container/20 rounded-full text-xs font-bold text-secondary">
                      Tone: Formal
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant/15 shadow-sm">
              <h4 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">groups</span>
                Participants
              </h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-tertiary-container ring-2 ring-white">
                    <img alt="Teacher" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAILvVgmWmBX5D5rhNmc7HP2nKDZWc4jNomGskv2TEr3g8o2GL6NrEYmhGhBvEZL9y_iAQMFKQ4hh3JsX0ZWtNXU7hVdQ2mWpEFLI40WJADLyKCvV5q7EsE6TlLljT_3cqdHodSU_IkDOFg5bCBPofY5hiLr25i9_whI9rG3EL1scpN81e13GgXKnfNzjPjDLsP1Yqs2vuCMXqIkGVoB0i3al2qgk1h3AdXvFBhRr_X89kfLtXy1HCDOIIERJzkfzviOJGOy0v5Pnq"/>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-on-surface text-sm">Ms. Sarah Miller</p>
                    <p className="text-[10px] text-on-surface-variant font-medium font-body">Character: Teacher</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-primary-container/10 border border-primary-container/20 rounded-xl relative shadow-sm">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-primary-container ring-2 ring-white">
                    <img alt="You" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDklNAmdhl7vT2pP57EM3GVQvWVfcSturTP0zqgyY10HElxeS8IQJuxnypvDAgmWWmYdvjrxU57FL2ye5hD2jfXyXmPNX8kYYLpZci97VVyI7H76-sv0AeQR_Znval7e_foJJ9tHV4HhoyIMhwTtgNlAEqzNGZyQ_cROTiXDsFI77x-PQoeGYjyajVm2T7sNwJynRgiDCGyz8hpFBjQ7S1yP4dRjdwsU_MNSpzUyYtPkbWX6Zlm1hAByz_0DI5hrTcMsavB-Snv0Svx"/>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-primary text-sm">Learner</p>
                    <p className="text-[10px] text-on-surface-variant font-medium font-body">Character: You</p>
                  </div>
                  <span className="absolute top-4 right-4 text-primary">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-lg p-6 border border-outline-variant/15 shadow-sm">
              <h4 className="font-headline font-bold text-on-surface mb-4">Level Progress</h4>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-extrabold text-secondary font-headline">0%</span>
                <span className="text-xs font-bold text-on-surface-variant font-headline">Goal: Mastery</span>
              </div>
              <div className="w-full h-3 bg-secondary-container rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full w-[0%] bg-secondary rounded-full">
                  <div className="absolute inset-0 bg-white/10 w-full animate-pulse"></div>
                </div>
              </div>
              <p className="mt-4 text-[10px] text-on-surface-variant leading-relaxed font-body italic">
                Completing this introduction will unlock the "Classroom Etiquette" node in your Journey Map.
              </p>
            </div>

            <div className="bg-tertiary-container/10 rounded-lg p-6 border-l-4 border-tertiary shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-tertiary">
                <span className="material-symbols-outlined text-sm">psychology</span>
                <span className="font-bold text-xs uppercase font-headline">Pro Tip</span>
              </div>
              <p className="text-xs text-on-tertiary-container italic font-body leading-relaxed">
                "In professional academic settings, addressing your teacher as 'Professor' or 'Ms./Mr. [Surname]' is standard practice in English-speaking cultures."
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full flex flex-col items-center gap-6 px-8 mt-20 py-12 border-t border-[#9aadd6]/10 bg-[#f5f6ff] text-center">
        <p className="font-body text-[10px] text-[#1a2e50]/60">© 2024 GrammarJourney. The Modern Pastoral Learning Path.</p>
      </footer>
    </div>
  );
}

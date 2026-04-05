"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (action: "login" | "signup" | "anonymous" | "google") => {
    setError(null);
    setLoading(true);
    
    try {
      if (action === "google") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      } else if (action === "anonymous") {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else if (action === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        router.push("/dashboard");
        router.refresh(); 
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen">
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-[#f5f6ff]/80 z-50">
        <div className="text-2xl font-bold tracking-tight text-[#005ea0] font-headline">GrammarJourney</div>
        <div className="hidden md:flex gap-8 items-center">
          <a className="text-[#005ea0] font-bold border-b-2 border-[#005ea0] font-headline text-sm" href="#">Home</a>
          <a className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity duration-200 font-headline text-sm" href="#features">Features</a>
          <a className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity duration-200 font-headline text-sm" href="#about">About Us</a>
        </div>
        <div className="flex gap-4">
          <button onClick={() => document.getElementById("auth-form")?.scrollIntoView({behavior: "smooth"})} className="px-6 py-2 rounded-xl text-primary font-semibold hover:bg-surface-container-low transition-colors">Log In</button>
          <button onClick={() => document.getElementById("auth-form")?.scrollIntoView({behavior: "smooth"})} className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-xl font-semibold shadow-[0_10px_20px_-5px_rgba(0,94,160,0.3)] hover:scale-95 transition-transform active:scale-90">Sign Up</button>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative px-6 py-12 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-headline font-bold text-xs mb-6 uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                Beginner-Friendly
              </div>
              <h1 className="font-headline font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight text-on-background mb-6">
                Unlock Your <span className="text-primary italic">Confidence.</span>
              </h1>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
                Start Your English Speaking Journey Today. Forget boring drills. Experience a modern pastoral learning path designed for real-life connection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => document.getElementById("auth-form")?.scrollIntoView({behavior: "smooth"})} className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-5 rounded-xl text-lg font-bold shadow-[0_20px_40px_-10px_rgba(0,94,160,0.4)] hover:scale-105 transition-transform">
                  Get Started Free
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 rounded-lg overflow-visible">
                <img alt="Diverse group communicating" className="rounded-lg shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAOyVocWMKNRYWNML3oXsG13O7HWEphIFlreNeveaCpcVV3LLyYJ5quoX0C1DmDdZiaVUz6-bd-dRQcbMITd2MdQQlJ0ac8R6MxUXk5iYhOvONN4nQAXz6VZRHLABUiB8I2FBSew9XOzZNgzjZeUCH8B49Y9gV7cczsAlPeWxlNVlUlHFSc4-Pi2mtbsVvHdca22Xl1dc_nE8Nt4EnX82dZmNeMNarqqMy-V0NsnCZ64d1RS2ndKMNifBykTJdUpFPlqQ0Wj5tQjUt"/>
              </div>
            </div>
          </div>
        </section>

        {/* Auth / Call to Action Section */}
        <section id="auth-form" className="px-6 py-24 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-panel p-12 md:p-20 rounded-lg shadow-2xl border border-white/60 relative z-10">
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-8">Ready to start your journey?</h2>
              
              {error && (
                <div style={{ padding: "1rem", backgroundColor: "rgba(255, 0, 0, 0.1)", color: "red", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "1rem", textAlign: "left" }}>
                  {error}
                </div>
              )}

              <div className="max-w-md mx-auto space-y-6">
                {/* Primary Google Login */}
                <button 
                  onClick={() => handleAuth("google")} 
                  disabled={loading} 
                  className="w-full flex items-center justify-center gap-4 py-5 bg-white border-2 border-outline-variant/10 rounded-2xl shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all duration-300 disabled:opacity-70 group"
                >
                  <img alt="Google" className="w-6 h-6 group-hover:scale-110 transition-transform" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzKi8FkPf0B73MyWPEKciBGtY7rP4xuakvLMZyywX3rDU_fLkW9-Ed6gtF3kMTufTJjsr4E6Gf80-7z25MoqTtk8p2vfQ1qTMhtW0UYIqbL9ZcNTNlzCWGpl-XmVpBji8dC879McSWKxBL54k67u0RPOeIWZBUI7xfTeaiQLAtVURkDcAqzNFbzDuRCoqgkVp35TQKg1F5Sq2P5jgEMrrHG01_-WJfaULNJ2Om7GURFGWE8abXvLREbL7riucT_Z_4drGQotOnTUNs"/>
                  <span className="font-headline font-bold text-lg text-on-surface">Continue with Google</span>
                </button>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="h-px bg-outline-variant/30 flex-1"></div>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-2">or use email</span>
                  <div className="h-px bg-outline-variant/30 flex-1"></div>
                </div>

                {/* Email Form */}
                <div className="space-y-4">
                  <div className="relative text-left">
                    <input 
                      type="email" 
                      className="w-full px-6 py-5 rounded-2xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary text-lg transition-all" 
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative text-left">
                    <input 
                      type="password" 
                      className="w-full px-6 py-5 rounded-2xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary text-lg transition-all" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    onClick={() => handleAuth("login")}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-5 rounded-2xl text-xl font-headline font-bold shadow-lg shadow-primary/20 hover:shadow-2xl hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-70"
                  >
                    {loading ? "Loading..." : "Log In"}
                  </button>
                  <button 
                    onClick={() => handleAuth("signup")}
                    disabled={loading}
                    className="w-full py-4 text-primary font-bold text-sm hover:underline"
                  >
                    New here? Create account
                  </button>
                </div>

                <div className="pt-4 flex flex-col items-center gap-4">
                  <button 
                    onClick={() => handleAuth("anonymous")} 
                    disabled={loading} 
                    className="flex items-center justify-center gap-2 py-3 px-8 bg-surface-container-lowest border border-outline-variant/20 rounded-full hover:bg-surface-container-low transition-colors disabled:opacity-70"
                  >
                    <span className="material-symbols-outlined text-sm">public</span>
                    <span className="font-bold text-sm">Try as Guest</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full fill-primary-container" viewBox="0 0 100 100">
                <path d="M0,50 Q25,0 50,50 T100,50 V100 H0 Z"></path>
              </svg>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full flex flex-col items-center gap-6 px-8 mt-20 border-t border-[#9aadd6]/10 py-12 bg-[#f5f6ff]">
        <div className="font-bold text-[#1a2e50] font-headline">GrammarJourney</div>
        <p className="font-body text-xs text-[#1a2e50]/60 text-center">© 2024 GrammarJourney. All rights reserved.</p>
      </footer>
    </div>
  );
}


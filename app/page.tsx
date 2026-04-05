"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-[#f5f6ff]/80 z-50">
        <div className="text-2xl font-bold tracking-tight text-[#005ea0] font-headline">GrammarJourney</div>
        <div className="hidden md:flex gap-8 items-center">
          <button className="text-[#005ea0] font-bold border-b-2 border-[#005ea0] font-headline text-sm">Home</button>
          <button className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity duration-200 font-headline text-sm">Features</button>
          <button className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity duration-200 font-headline text-sm">About Us</button>
          <div className="flex items-center gap-4 ml-4">
            <span className="material-symbols-outlined text-[#005ea0]">notifications</span>
            <span className="material-symbols-outlined text-[#005ea0]">emoji_events</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.push("/login")} className="px-6 py-2 rounded-xl text-primary font-semibold hover:bg-surface-container-low transition-colors font-headline">Log In</button>
          <button onClick={() => router.push("/login")} className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-xl font-semibold shadow-[0_10px_20px_-5px_rgba(0,94,160,0.3)] hover:scale-95 transition-transform active:scale-90 font-headline">Sign Up</button>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative px-6 py-12 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-headline font-bold text-xs mb-6 uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Beginner-Friendly
              </motion.div>
              <h1 className="font-headline font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight text-on-background mb-6">
                Unlock Your <span className="text-primary italic">Confidence.</span>
              </h1>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-body">
                Start Your English Speaking Journey Today. Forget boring drills. Experience a modern pastoral learning path designed for real-life connection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => router.push("/login")} className="bg-gradient-to-r from-primary to-primary-container text-white px-10 py-5 rounded-xl text-lg font-bold shadow-[0_20px_40px_-10px_rgba(0,94,160,0.4)] hover:scale-105 transition-transform font-headline">
                  Get Started Free
                </button>
                <button className="border-2 border-outline-variant/30 text-primary px-10 py-5 rounded-xl text-lg font-bold hover:bg-surface-container-low transition-colors font-headline">
                  View Curriculum
                </button>
              </div>
            </div>
            <div className="relative">
              {/* Decorative Background Shapes */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl"></div>
              {/* Hero Image */}
              <div className="relative z-10 rounded-lg overflow-visible">
                <img alt="Diverse group communicating" className="rounded-lg shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAOyVocWMKNRYWNML3oXsG13O7HWEphIFlreNeveaCpcVV3LLyYJ5quoX0C1DmDdZiaVUz6-bd-dRQcbMITd2MdQQlJ0ac8R6MxUXk5iYhOvONN4nQAXz6VZRHLABUiB8I2FBSew9XOzZNgzjZeUCH8B49Y9gV7cczsAlPeWxlNVlUlHFSc4-Pi2mtbsVvHdca22Xl1dc_nE8Nt4EnX82dZmNeMNarqqMy-V0NsnCZ64d1RS2ndKMNifBykTJdUpFPlqQ0Wj5tQjUt"/>
                {/* Floating Achievement Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-xl border border-white/40 max-w-[240px]">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white">
                      <span className="material-symbols-outlined">forum</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-headline font-bold uppercase tracking-wider">DAILY GOAL</p>
                      <p className="font-bold text-on-surface text-sm">Fluent Dialogues</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-secondary-container rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-secondary relative">
                      <div className="absolute top-0 right-0 h-full w-4 bg-white/20 skew-x-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="px-6 py-24 bg-surface-container-low" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl font-extrabold mb-4">Why GrammarJourney?</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto font-body">We've reimagined English learning as a scenic walk through a landscape of language.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="md:col-span-2 bg-surface-container-lowest p-10 rounded-lg border border-outline-variant/10 flex flex-col md:flex-row gap-8 items-center group shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 text-left">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                    <span className="material-symbols-outlined text-3xl">auto_stories</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold mb-4">No alphabets, just action</h3>
                  <p className="text-on-surface-variant leading-relaxed mb-6 font-body">Dive straight into communication. We skip the rote memorization and focus on the natural patterns of speech used by natives every day.</p>
                  <button className="text-primary font-bold inline-flex items-center gap-2 group-hover:gap-4 transition-all font-headline">Explore our method <span className="material-symbols-outlined">arrow_forward</span></button>
                </div>
                <div className="w-full md:w-1/2 overflow-hidden rounded-lg">
                  <img alt="Action learning" className="rounded-lg shadow-lg group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhpqYA92oI6zx04839TZHImqPbvj8i5GsFHYBqYXvkwrEY7Cyv8df9wCEO_xpzakGLLWLJkUhQ8-y8pxXqEOyHvjs7SBrom9kLqgkC-AI1RRJflFfsUpr5st6WRUlaFta2W2gdfMDb-jQnCZMvS_ImPBmm1cu1_58BNkZt-8UTW95sQKxOI7cQkGqHg4FkOalglVJMnqnyCX85fCK5G04K9JSZhqurxq7OrYlBJ9whHFxsEL-8JWns_mAzK-u5OsqL_zxIg-39maf3"/>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-secondary to-secondary-dim p-10 rounded-lg text-white flex flex-col justify-between shadow-lg">
                <div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold mb-4">Learn by doing</h3>
                  <p className="text-on-secondary/80 leading-relaxed font-body">Our interactive Journey Map challenges you to apply knowledge instantly through immersive role-play scenarios.</p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex -space-x-3 mb-4">
                    <img alt="User 1" className="w-10 h-10 rounded-full border-2 border-secondary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO9Dv718FT09oBrgggy4R8uZhxint6SA8fqEZh9Ko0B_APWW1ZuyI2Hrqtj01meej2X7Z90uQdobSw0TGCXFj0M8wOC2f40ESfbUDEIyObQAUnvTS87IsHqGK_n7QwPCqJPnJUawTYANMC7b-3aS9cN33tvz-LbbACqRwm8OaoP--sigupBpUR8sS_SQZwmRscQtqy6P6zQSNoTo7Wq4DiCyj7Xa9JOvRBQ9KmXisZ0ntocib8Yc1ehY4YoxawIgHByEPcztpNi9Er"/>
                    <img alt="User 2" className="w-10 h-10 rounded-full border-2 border-secondary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMZZysQg4p7fjCwfjWWvMUTsMFcBHPIbZ0e4xc5Ov07iu2taOoAwbHT1LyK_nQz1XsZrQ26OILd8GkSP7XMwYaTxmHRarRMUvy4Uxr2KSExoum0Gc9Ta_ibz5qr2-kwubXhIYTLkDl14anjAxMxvGTYj2My75zMlWzyc-XZSJfoDUhDjNYp9UOsuSopsLIrnsk4IfIrGRWbQMQ7cnsYAFQFFnc1SbMJE0avcGTNnSAegeqMk3OhrJMozqTP9X3cNelxmfwY6mKQ2a6"/>
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold border-2 border-secondary">+2k</div>
                  </div>
                  <p className="text-xs font-medium font-body">Joined by 2,000+ learners today</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-surface-container-lowest p-10 rounded-lg border border-outline-variant/10 flex flex-col justify-between group shadow-sm hover:shadow-md transition-shadow">
                <div className="text-left">
                  <div className="w-14 h-14 bg-tertiary/10 rounded-2xl flex items-center justify-center mb-6 text-tertiary">
                    <span className="material-symbols-outlined text-3xl">location_city</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold mb-4">Real-life scenarios</h3>
                  <p className="text-on-surface-variant leading-relaxed font-body">From ordering coffee in London to leading a meeting in New York, we prepare you for the world as it is.</p>
                </div>
                <div className="mt-8 overflow-hidden rounded-lg">
                  <img alt="Real life scenario" className="rounded-lg group-hover:scale-110 transition-transform duration-700 w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUqj9nONrTYGvGygkyY5sCw1D4pnUHsgsmHdTrmZrwVX-4hRsSXTwog4QMevW0LtRDXxGULKy7gyAWs_i_oWS6YWqsaYoQka8zIWXniwEJLChvKwI2rUvtFXbtAx7eXBActbrGrENPVp7knL_wKUFmj_i0C82hM_R9YzqfJ3ofpUoEfG3o4tBLGayIrc-HGTfW_7A0xAPVh27Oq6YSHH9_pNs4tN6T9EWFt6H_xvG-y7NmC044106MYMHJoS5GlDc6mfmvPRAm42H9"/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24 relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/40 backdrop-blur-lg p-12 md:p-20 rounded-lg shadow-2xl border border-white/60 relative z-10">
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-8">Ready to start your journey?</h2>
              <p className="text-xl text-on-surface-variant mb-12 font-body">Join thousands of students mastering English through the Modern Pastoral path.</p>
              <div className="max-w-md mx-auto space-y-4">
                <button onClick={() => router.push("/login")} className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-5 rounded-xl text-xl font-bold shadow-lg hover:shadow-2xl transition-shadow font-headline">
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col items-center gap-6 px-8 mt-20 border-t border-[#9aadd6]/10 py-12 bg-[#f5f6ff]">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <button className="font-headline text-xs text-[#1a2e50]/60 hover:text-[#005ea0] transition-colors">Help Center</button>
          <button className="font-headline text-xs text-[#1a2e50]/60 hover:text-[#005ea0] transition-colors">About Us</button>
          <button className="font-headline text-xs text-[#1a2e50]/60 hover:text-[#005ea0] transition-colors">Privacy Policy</button>
          <button className="font-headline text-xs text-[#1a2e50]/60 hover:text-[#005ea0] transition-colors">Terms of Service</button>
        </div>
        <div className="font-bold text-[#1a2e50] font-headline">GrammarJourney</div>
        <p className="font-body text-xs text-[#1a2e50]/60 text-center">© 2024 GrammarJourney. The Modern Pastoral Learning Path.</p>
      </footer>
    </div>
  );
}

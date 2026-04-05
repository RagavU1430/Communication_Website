"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import MfaSetup from "@/components/MfaSetup";
import { useAuth } from "@/components/AuthProvider";

// Badge definitions
const BADGE_DEFINITIONS = [
  { key: "level_1", level: 1, title: "First Steps", description: "Complete Level 1: Present Tense", icon: "directions_walk", gradient: "from-[#00693e] to-[#91f8b8]" },
  { key: "level_2", level: 2, title: "Time Traveler", description: "Complete Level 2: Past Tense", icon: "history", gradient: "from-[#005ea0] to-[#66affe]" },
  { key: "level_3", level: 3, title: "Fortune Teller", description: "Complete Level 3: Future Plans", icon: "auto_awesome", gradient: "from-[#6D28D9] to-[#C084FC]" },
  { key: "level_4", level: 4, title: "Architect", description: "Complete Level 4: Building Blocks", icon: "construction", gradient: "from-[#B45309] to-[#FCD34D]" },
  { key: "level_5", level: 5, title: "Master Orator", description: "Complete Level 5: Mastery", icon: "military_tech", gradient: "from-[#DC2626] to-[#F87171]" },
];

export default function Profile() {
  const router = useRouter();
  const supabase = createClient();
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userEmail = user?.email ?? "Unknown";
  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Learner";

  // Load avatar from user metadata (Google provides avatar_url)
  useEffect(() => {
    if (user) {
      const googleAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
      const customAvatar = user.user_metadata?.custom_avatar_url;
      setAvatarUrl(customAvatar || googleAvatar || null);
    }
  }, [user]);

  // Load earned badges from Supabase
  useEffect(() => {
    const loadBadges = async () => {
      if (!user) { setLoadingBadges(false); return; }
      try {
        const { data, error } = await supabase
          .from("user_badges")
          .select("badge_key")
          .eq("user_id", user.id);
        if (error) throw error;
        setEarnedBadges(data?.map((b: any) => b.badge_key) || []);
      } catch (err) {
        console.error("Error loading badges:", err);
      } finally {
        setLoadingBadges(false);
      }
    };
    loadBadges();
  }, [user, supabase]);

  const handleUpdateProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: tempName }
    });
    if (!error) {
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update user metadata with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { custom_avatar_url: `${publicUrl}?t=${Date.now()}` }
      });
      if (updateError) throw updateError;

      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDQRFQ-WpUU0EUrUD1N6Zk1itg3qHE84kiBENnAZndeBEVpsk_iDcpl_YvcVcaU2WvL0qtzbL8gopzzvui5uOfDF1YMx-l87Lnvhdjyrp4WfYt3revLxVGpG_zpgQ_AGzFutOsl86dvMdio7Lcp528Nh27Pfke8CxHIP4uGLXrB2ei8Hx-IOV4ON1hSfZvFdmmijhJtcHqnIpKLLAut6m1qfgkxWhMaalQKihJdHIlzDv57pfKveWHCKmcDrFGj0737ZkiBH4rxiM1X";

  return (
    <div className="bg-background text-on-background font-body min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-[#f5f6ff] z-50">
        <div className="flex items-center gap-8">
          <button onClick={() => router.push("/dashboard")} className="text-2xl font-bold tracking-tight text-[#005ea0]">GrammarJourney</button>
          <div className="hidden md:flex gap-6 font-headline text-sm font-medium">
            <button onClick={() => router.push("/dashboard")} className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity">Home</button>
            <button onClick={() => router.push("/learning-map")} className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity">Journey Map</button>
            <button onClick={() => router.push("/history")} className="text-[#1a2e50] opacity-70 hover:opacity-100 transition-opacity">History</button>
            <button className="text-[#005ea0] font-bold border-b-2 border-[#005ea0]">Profile</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">notifications</span>
          <span className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">emoji_events</span>
          <div className="w-10 h-10 rounded-full border-2 border-primary-fixed overflow-hidden">
            <img alt="User profile" src={avatarUrl || defaultAvatar} className="w-full h-full object-cover" loading="lazy" />
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
          <button onClick={() => router.push("/history")} className="w-full text-[#1a2e50] px-4 py-3 mx-2 flex items-center gap-3 hover:bg-[#d7e2ff]/50 rounded-full transition-all font-headline font-semibold">
            <span className="material-symbols-outlined">history</span> History
          </button>
          <button className="w-full bg-linear-to-r from-[#005ea0] to-[#66affe] text-white rounded-full mx-2 my-1 px-4 py-3 flex items-center gap-3 font-headline font-semibold">
            <span className="material-symbols-outlined">person</span> Profile
          </button>
        </nav>
        <div className="px-4 mt-auto">
          <button onClick={() => router.push("/practice")} className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-headline font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
            Start Daily Challenge
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="pt-24 pb-12 lg:ml-64 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-8">
            {/* Profile Photo with Upload */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden ring-4 ring-white shadow-xl">
                <img 
                  alt="Profile" 
                  src={avatarUrl || defaultAvatar} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Upload overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg">
                  {uploading ? "hourglass_empty" : "photo_camera"}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <div className="absolute -bottom-4 -right-4 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant/15 shadow-sm">
                <span className="text-primary font-headline font-extrabold">LVL 1</span>
              </div>
            </div>
            <div>
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-surface-container-low border border-primary/20 rounded-lg px-4 py-2 font-headline font-bold text-2xl outline-none focus:ring-2 ring-primary/30"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleUpdateProfile} className="px-4 py-2 bg-primary text-white rounded-full font-bold text-xs">Save Changes</button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-surface-container-high text-on-surface rounded-full font-bold text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-2">{displayName}</h1>
                  <p className="text-xl font-body text-on-surface-variant">Level 1 Beginner • Path Explorer</p>
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => { setTempName(displayName); setIsEditing(true); }} className="px-6 py-2 bg-surface-container-lowest text-primary border border-outline-variant/15 rounded-full font-headline font-bold text-sm hover:bg-surface-container-low transition-colors">
                      Edit Profile
                    </button>
                    <button onClick={handleLogout} className="px-6 py-2 text-error font-headline font-bold text-sm hover:bg-error-container/10 rounded-full transition-colors">
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Security Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3 text-on-surface">
            <span className="material-symbols-outlined text-primary">security</span>
            Security Settings
          </h2>
          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
            <MfaSetup />
          </div>
        </section>

        {/* Bento Grid Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm flex flex-col justify-between group hover:bg-primary hover:text-white transition-all duration-300">
            <div className="flex justify-between items-start mb-8">
              <span className="material-symbols-outlined text-3xl group-hover:text-white transition-colors">schedule</span>
              <span className="text-xs font-headline font-bold text-on-surface-variant group-hover:text-white/80">SINCE JOINING</span>
            </div>
            <div>
              <h3 className="text-4xl font-headline font-extrabold">0h</h3>
              <p className="opacity-70 font-body mt-1">Total Time Spent</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm flex flex-col justify-between group hover:bg-secondary hover:text-white transition-all duration-300">
            <div className="flex justify-between items-start mb-8">
              <span className="material-symbols-outlined text-3xl group-hover:text-white transition-colors">target</span>
              <span className="text-xs font-headline font-bold text-on-surface-variant group-hover:text-white/80">AVERAGE</span>
            </div>
            <div>
              <h3 className="text-4xl font-headline font-extrabold">0%</h3>
              <p className="opacity-70 font-body mt-1">Accuracy</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm flex flex-col justify-between group hover:bg-tertiary-dim hover:text-white transition-all duration-300">
            <div className="flex justify-between items-start mb-8">
              <span className="material-symbols-outlined text-3xl group-hover:text-white transition-colors">menu_book</span>
              <span className="text-xs font-headline font-bold text-on-surface-variant group-hover:text-white/80">PROGRESS</span>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-3xl font-headline font-extrabold">0/50</h3>
                <span className="text-secondary font-bold group-hover:text-white">0%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="w-[0%] h-full bg-gradient-to-r from-secondary to-secondary-fixed-dim rounded-full" />
              </div>
              <p className="opacity-70 font-body mt-3 text-sm">Lessons Completed</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* History */}
          <div className="xl:col-span-2">
            <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">timeline</span>
              Learning History
            </h2>
            <div className="space-y-4">
              <div className="bg-surface-container-low p-8 rounded-lg text-center border-2 border-dashed border-outline-variant/10">
                <p className="text-on-surface-variant font-body italic">No history yet. Start your first lesson!</p>
              </div>
            </div>
          </div>

          {/* Badges / Achievements */}
          <div>
            <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3 text-on-surface">
              <span className="material-symbols-outlined text-tertiary">workspace_premium</span>
              Achievements
            </h2>
            <div className="space-y-4">
              {loadingBadges ? (
                <div className="bg-surface-container p-8 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                BADGE_DEFINITIONS.map((badge) => {
                  const isEarned = earnedBadges.includes(badge.key);
                  return (
                    <motion.div
                      key={badge.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: badge.level * 0.1 }}
                      className={`relative p-5 rounded-xl border transition-all ${
                        isEarned
                          ? "bg-surface-container-lowest border-outline-variant/20 shadow-md"
                          : "bg-surface-container border-outline-variant/5 opacity-50 grayscale"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                          isEarned 
                            ? `bg-gradient-to-br ${badge.gradient} text-white shadow-lg` 
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}>
                          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isEarned ? "'FILL' 1" : "'FILL' 0" }}>
                            {isEarned ? badge.icon : "lock"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-headline font-bold text-sm text-on-surface">{badge.title}</h4>
                          <p className="text-xs text-on-surface-variant mt-0.5">{badge.description}</p>
                        </div>
                        {isEarned && (
                          <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                        )}
                      </div>
                      {/* Glow effect for earned badges */}
                      {isEarned && (
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${badge.gradient} opacity-[0.04] pointer-events-none`} />
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full flex flex-col items-center gap-6 px-8 mt-20 border-t border-[#9aadd6]/10 py-12">
        <p className="text-xs font-body text-[#1a2e50]/60 text-center">
            © 2024 GrammarJourney. The Modern Pastoral Learning Path.
        </p>
      </footer>
    </div>
  );
}

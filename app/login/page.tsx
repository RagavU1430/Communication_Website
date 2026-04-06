"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (action: "login" | "signup" | "anonymous" | "google" | "verify") => {
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
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`,
              phone: phone,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setOtpSent(true);
        alert("A verification code has been sent to your email!");
      } else if (action === "verify") {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'signup',
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
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
        <div className="text-2xl font-bold tracking-tight text-[#005ea0] font-headline cursor-pointer" onClick={() => router.push("/")}>GrammarJourney</div>
        <div className="flex gap-4">
          {!isSignUpMode ? (
            <button onClick={() => setIsSignUpMode(true)} className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:scale-95 transition-transform">Sign Up</button>
          ) : (
            <button onClick={() => setIsSignUpMode(false)} className="px-6 py-2 rounded-xl text-primary font-semibold hover:bg-surface-container-low transition-colors">Log In</button>
          )}
        </div>
      </nav>

      <main className="pt-24 pb-12">
        <section id="auth-form" className="px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-panel p-8 md:p-12 rounded-lg shadow-2xl border border-white/60 relative z-10 bg-white/40">
              <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-8">
                {otpSent ? "Verify Email" : isSignUpMode ? "Create Your Account" : "Welcome Back"}
              </h2>
              
              {error && (
                <div className="p-4 bg-error-container text-error rounded-xl mb-6 text-sm text-left border border-error/20">
                  {error}
                </div>
              )}

              <div className="max-w-md mx-auto space-y-4">
                {otpSent ? (
                  <>
                    <p className="text-sm text-on-surface-variant mb-4">We've sent a code to <b>{email}</b>. Enter it below to activate your account.</p>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 rounded-2xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary text-center text-2xl tracking-[1rem] font-bold" 
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                    <button 
                      onClick={() => handleAuth("verify")}
                      disabled={loading}
                      className="w-full bg-primary text-white py-4 rounded-2xl text-lg font-headline font-bold shadow-lg hover:bg-primary-dim transition-all"
                    >
                      {loading ? "Verifying..." : "Verify & Continue"}
                    </button>
                    <button onClick={() => setOtpSent(false)} className="text-sm text-primary font-bold hover:underline">Back to Signup</button>
                  </>
                ) : (
                  <>
                    {!isSignUpMode && (
                      <button 
                        onClick={() => handleAuth("google")} 
                        disabled={loading} 
                        className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-outline-variant/20 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                      >
                        <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzKi8FkPf0B73MyWPEKciBGtY7rP4xuakvLMZyywX3rDU_fLkW9-Ed6gtF3kMTufTJjsr4E6Gf80-7z25MoqTtk8p2vfQ1qTMhtW0UYIqbL9ZcNTNlzCWGpl-XmVpBji8dC879McSWKxBL54k67u0RPOeIWZBUI7xfTeaiQLAtVURkDcAqzNFbzDuRCoqgkVp35TQKg1F5Sq2P5jgEMrrHG01_-WJfaULNJ2Om7GURFGWE8abXvLREbL7riucT_Z_4drGQotOnTUNs"/>
                        <span className="font-headline font-bold text-on-surface">Continue with Google</span>
                      </button>
                    )}

                    {isSignUpMode && (
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="First Name" 
                          className="w-full px-5 py-4 rounded-2xl bg-surface-container-low focus:ring-2 focus:ring-primary outline-none"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input 
                          type="text" 
                          placeholder="Last Name" 
                          className="w-full px-5 py-4 rounded-2xl bg-surface-container-low focus:ring-2 focus:ring-primary outline-none"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    )}

                    {isSignUpMode && (
                      <input 
                        type="tel" 
                        placeholder="Contact Number" 
                        className="w-full px-5 py-4 rounded-2xl bg-surface-container-low focus:ring-2 focus:ring-primary outline-none"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    )}

                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full px-5 py-4 rounded-2xl bg-surface-container-low focus:ring-2 focus:ring-primary outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="w-full px-5 py-4 rounded-2xl bg-surface-container-low focus:ring-2 focus:ring-primary outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <button 
                      onClick={() => handleAuth(isSignUpMode ? "signup" : "login")}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-2xl text-lg font-headline font-bold shadow-xl hover:scale-[1.01] active:scale-100 transition-all disabled:opacity-70"
                    >
                      {loading ? "Processing..." : isSignUpMode ? "Register Now" : "Log In"}
                    </button>

                    <p className="text-sm text-on-surface-variant font-medium">
                      {isSignUpMode ? "Already have an account?" : "New here?"}{" "}
                      <button 
                        onClick={() => setIsSignUpMode(!isSignUpMode)} 
                        className="text-primary font-bold hover:underline"
                      >
                        {isSignUpMode ? "Log In" : "Create account"}
                      </button>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full text-center py-8 border-t border-outline-variant/10">
        <p className="text-xs text-on-surface-variant">© 2024 GrammarJourney. All rights reserved.</p>
      </footer>
    </div>
  );
}


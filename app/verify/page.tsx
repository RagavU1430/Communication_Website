"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Verify() {
  const router = useRouter();
  const supabase = createClient();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user has a factor enrolled
    const checkFactors = async () => {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) {
        setError(error.message);
        return;
      }
      if (data.nextLevel === "aal2" && data.currentLevel === "aal1") {
        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) {
          setError(factorsError.message);
          return;
        }
        
        const totpFactor = factorsData.totp[0];
        if (totpFactor) {
          setFactorId(totpFactor.id);
        } else {
          setError("No TOTP factor found. Please log out and back in.");
        }
      } else {
        // Not required to be here
        router.push("/dashboard");
      }
    };
    checkFactors();
  }, [router, supabase.auth.mfa]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;
    
    setError(null);
    setLoading(true);
    
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) throw verifyError;
      
      // Verification successful, proceed to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid authentication code.");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary-container selection:text-on-primary-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-lg shadow-xl border border-outline-variant/10 text-center"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 shadow-sm">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">Security Check</h1>
          <p className="text-on-surface-variant text-sm mt-2 font-body max-w-[280px]">
            Enter the 6-digit code from Google Authenticator to secure your session.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container/10 border border-error-container/20 rounded-xl text-error text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="000 000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              required
              className="w-full px-6 py-5 bg-surface-container-low border-none rounded-xl text-center text-3xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-primary-container transition-all outline-none placeholder:text-on-surface-variant/20 shadow-inner"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || code.length !== 6 || !factorId}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-5 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-headline disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant font-medium">
            Having trouble? <button className="text-primary font-bold hover:underline">Contact support</button>
          </p>
        </div>
      </motion.div>
      
      <p className="mt-8 text-xs text-on-surface-variant/60 font-body">
        © 2024 GrammarJourney. Protected by Supabase MFA.
      </p>
    </div>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function MfaSetup() {
  const supabase = createClient();
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingFactors, setCheckingFactors] = useState(true);
  const [status, setStatus] = useState<"idle" | "enrolling" | "verified">("idle");

  // Check if user already has a verified TOTP factor
  useEffect(() => {
    const checkExistingFactors = async () => {
      try {
        const { data, error } = await supabase.auth.mfa.listFactors();
        if (error) throw error;

        const verifiedTotp = data.totp?.find(
          (factor: any) => factor.status === "verified"
        );
        if (verifiedTotp) {
          setStatus("verified");
        }
      } catch (err) {
        console.error("Error checking MFA factors:", err);
      } finally {
        setCheckingFactors(false);
      }
    };

    checkExistingFactors();
  }, [supabase]);

  const handleEnroll = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });
      if (error) throw error;
      
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setStatus("enrolling");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;
      
      setStatus("verified");
    } catch (err: any) {
      setError(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state while we check for existing factors
  if (checkingFactors) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md border border-outline-variant/10 flex items-center justify-center">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-body text-sm">Checking security settings...</span>
        </div>
      </div>
    );
  }

  if (status === "verified") {
    return (
      <div className="bg-white p-10 rounded-lg shadow-xl border border-outline-variant/10 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-on-surface font-headline">Authenticator Enabled</h3>
          <p className="text-on-surface-variant text-sm mt-2 font-body max-w-[280px]">
            Your account is now protected with Two-Factor Authentication.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-outline-variant/10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <ShieldAlert size={20} />
        </div>
        <h3 className="text-xl font-bold text-on-surface font-headline">Two-Factor Authentication</h3>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-error-container/10 border border-error-container/20 rounded-xl text-error text-sm font-medium">
          {error}
        </div>
      )}

      {status === "idle" && (
        <div className="text-left">
          <p className="text-on-surface-variant text-sm mb-6 font-body leading-relaxed">
            Add an extra layer of security to your account by enabling Google Authenticator.
          </p>
          <button 
            onClick={handleEnroll} 
            disabled={loading}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-headline disabled:opacity-50"
          >
            {loading ? "Generating..." : "Set up Authenticator App"}
          </button>
        </div>
      )}

      {status === "enrolling" && (
        <div className="text-left space-y-6">
          <div>
            <p className="text-sm font-bold text-on-surface mb-4 font-headline">1. Scan this QR code with Google Authenticator:</p>
            <div 
              className="bg-white p-4 border border-outline-variant/20 rounded-xl inline-block shadow-inner"
              dangerouslySetInnerHTML={{ __html: qrCode }} 
            />
          </div>
          
          <div>
            <p className="text-sm font-bold text-on-surface mb-4 font-headline">2. Enter the 6-digit code from the app:</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full sm:w-40 px-4 py-4 bg-surface-container-low border-none rounded-xl text-2xl font-bold tracking-[0.2em] focus:ring-2 focus:ring-primary-container transition-all outline-none text-center shadow-inner"
              />
              <button 
                onClick={handleVerify} 
                disabled={loading || verifyCode.length !== 6}
                className="flex-1 bg-gradient-to-r from-primary to-primary-container text-white py-4 px-8 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-headline disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Enable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

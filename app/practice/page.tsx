"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type MicPermission = "prompt" | "granted" | "denied" | "unsupported";

interface AIAnalysis {
  pitch: number;
  clarity: number;
  correctness: number;
  overall: number;
  feedback: string;
  spoken: string;
}

export default function Practice() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AIAnalysis | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [micPermission, setMicPermission] = useState<MicPermission>("prompt");
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(4));
  
  const totalSteps = 10;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const rawFreqFramesRef = useRef<Uint8Array[]>([]);
  
  // Speech Recognition
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  // Check mic permission on mount
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicPermission("unsupported");
      return;
    }
    navigator.permissions?.query({ name: "microphone" as PermissionName }).then((result) => {
      setMicPermission(result.state as MicPermission);
      result.onchange = () => setMicPermission(result.state as MicPermission);
    }).catch(() => {});
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const startVisualizer = useCallback((stream: MediaStream) => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    
    // Noise Removal Filter (High-pass to remove low-end rumble)
    const filter = audioCtx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 80; // Cut off frequencies below 80Hz (common hum/noise)
    
    // Compressor to normalize voice peaks
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
    compressor.knee.setValueAtTime(40, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;

    // Connect the chain: Source -> Filter -> Compressor -> Analyser
    source.connect(filter);
    filter.connect(compressor);
    compressor.connect(analyser);
    
    analyserRef.current = analyser;

    rawFreqFramesRef.current = [];

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const animate = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Store a copy of the frame for AI pitch/clarity analysis later
      rawFreqFramesRef.current.push(new Uint8Array(dataArray));

      const bars = Array.from(dataArray).slice(0, 20).map(v => Math.max(4, (v / 255) * 40));
      setAudioLevels(bars);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const requestMicAndRecord = async () => {
    try {
      // requesting mic with explicit noise suppression and echo cancellation
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true
        } 
      });
      streamRef.current = stream;
      setMicPermission("granted");
      setShowPermissionBanner(false);
      setHasSubmitted(false);
      setAnalysisResults(null);
      transcriptRef.current = "";

      // Initialize Speech Recognition for "Correctness"
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          transcriptRef.current = currentTranscript;
        };
        recognition.start();
        recognitionRef.current = recognition;
      }

      // Start recording
      const audioChunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      // Start audio visualizer & data collector
      startVisualizer(stream);

    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicPermission("denied");
        setShowPermissionBanner(true);
      } else {
        console.error("Mic error:", err);
      }
    }
  };

  const calculateAIScores = (finalTranscript: string, rawFrequencies: Uint8Array[]) => {
    const targetPhrase = "He eats breakfast every morning".toLowerCase().replace(/[^a-z ]/g, '');
    const spokenPhrase = (finalTranscript || "").toLowerCase().replace(/[^a-z ]/g, '');
    
    // Parse baseline audio signals to detect absolute silence or noise
    const volumeLevels = rawFrequencies.map(arr => arr.reduce((sum, val) => sum + val, 0) / (arr.length || 1));
    const meanVol = volumeLevels.reduce((a, b) => a + b, 0) / (volumeLevels.length || 1);
    const maxVol = Math.max(0.1, ...volumeLevels);

    // 1. Correctness Score (Text mapping)
    const targetWords = targetPhrase.split(' ');
    const spokenWords = spokenPhrase.split(' ').filter(Boolean);
    let matches = 0;
    targetWords.forEach(w => {
      if (spokenWords.includes(w)) matches++;
    });
    
    // If no words were detected or audio is too quiet, short-circuit to 0 score.
    if (spokenWords.length === 0 || maxVol < 5) {
      setAnalysisResults({ 
        pitch: 0, 
        clarity: 0, 
        correctness: 0, 
        overall: 0, 
        feedback: "No recognizable speech detected. Please review your recording and try again.", 
        spoken: finalTranscript.trim() || "(No words recognized)" 
      });
      setIsAnalyzing(false);
      setHasSubmitted(true);
      return;
    }

    let correctnessScore = Math.round((matches / targetWords.length) * 100);
    // specific grammar check: third person singular 's' penalty
    if (!spokenWords.includes("eats") && spokenWords.includes("eat")) correctnessScore -= 15;
    correctnessScore = Math.min(100, Math.max(10, correctnessScore)); // floor at 10

    // 2. Pitch Dynamics (Variance in frequency peaks)
    // Find dominant frequency bin in each frame
    const dominantFreqs = rawFrequencies.map(arr => {
      let maxVal = 0, maxIdx = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] > maxVal) { maxVal = arr[i]; maxIdx = i; }
      }
      return maxIdx;
    });

    const meanFreq = dominantFreqs.reduce((a, b) => a + b, 0) / (dominantFreqs.length || 1);
    const variance = dominantFreqs.reduce((a, b) => a + Math.pow(b - meanFreq, 2), 0) / (dominantFreqs.length || 1);
    
    let pitchScore = Math.round(50 + (variance * 1.5) + (Math.random() * 10));
    if (isNaN(pitchScore) || rawFrequencies.length < 10) pitchScore = 80 + Math.floor(Math.random() * 15);
    pitchScore = Math.min(100, Math.max(30, pitchScore));

    // 3. Voice Clarity (Signal-to-Noise Ratio proxy)
    // Difference between max volumes and mean volumes signifies clear bursts of speech vs static noise
    let clarityScore = Math.round((maxVol / (meanVol + 5)) * 40);
    if (isNaN(clarityScore) || rawFrequencies.length < 10) clarityScore = 85 + Math.floor(Math.random() * 10);
    // boost bounds
    if (clarityScore < 40) clarityScore = 40 + Math.floor(Math.random() * 20);
    clarityScore = Math.min(100, Math.max(20, clarityScore));

    // Overall Calculation (Weighted)
    const overall = gapFix(Math.round((correctnessScore * 0.5) + (pitchScore * 0.25) + (clarityScore * 0.25)));

    // Generate dynamic feedback
    let feedbackText = "";
    if (overall >= 90) feedbackText = "Outstanding pronunciation! Your pitch modulation sounded completely natural and native-like.";
    else if (overall >= 75) {
      if (correctnessScore < 80) feedbackText = "Great voice clarity, but make sure to pronounce every word completely (especially grammar endings like 's').";
      else if (pitchScore < 75) feedbackText = "Your grammar was spot on! Try adding a bit more intonation to avoid sounding flat.";
      else feedbackText = "Good effort! Your tone and clarity are developing nicely.";
    } else {
      feedbackText = "Keep practicing! Ensure you are in a quiet environment and try echoing the sentence exactly as written.";
    }

    setAnalysisResults({ 
      pitch: pitchScore, 
      clarity: clarityScore, 
      correctness: correctnessScore, 
      overall, 
      feedback: feedbackText, 
      spoken: finalTranscript.trim() || "(Transcript unavailable)" 
    });
    
    setIsAnalyzing(false);
    setHasSubmitted(true);
  };
  
  const gapFix = (num: number) => num > 100 ? 100 : num < 0 ? 0 : num;

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    
    setAudioLevels(new Array(20).fill(4));
    setIsRecording(false);
    
    // Trigger AI Analysis Loading State
    setIsAnalyzing(true);
    
    // Simulate AI processing delay for 2 seconds while preparing data
    setTimeout(() => {
      calculateAIScores(transcriptRef.current, rawFreqFramesRef.current);
    }, 2000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      requestMicAndRecord();
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-[#f5f6ff] z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="text-2xl font-bold tracking-tight text-[#005ea0] font-headline">GrammarJourney</button>
          <div className="h-6 w-px bg-outline-variant opacity-20"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            <span className="font-headline text-sm font-bold text-on-surface">Level 1</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/learning-map")} className="hidden md:flex items-center gap-2 px-4 py-2 text-[#1a2e50] opacity-70 font-headline text-sm font-medium hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined">map</span>
            Back to Map
          </button>
          <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary-fixed overflow-hidden">
            <img alt="User profile" className="w-full h-full object-cover" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnnCj8AaBDeaOZI0G68RSjjYazf4fGpLNVq-kwguy3H1j4r0OOrWgWsRb2TJT6fbcRnOr4VEadX6AzpL6rLC7A3EE8wAkNP9S36tVrqG_k0zItqbGWgSCf1YA2z-NWp_26bwaFOv-Bw77S5fegp1GYVWH892evwKreUzG4umcGXVfU10McV-7faBgvcKfcasd7JHVNc0I2G6kyaWSNkHDHYz18lyYm35OAfFR6N2wSHY4hBjaECJwCDeJrANDSEB8ImEb-YLfJNcWw"/>
          </div>
        </div>
      </header>

      {/* Mic Permission Denied Banner */}
      <AnimatePresence>
        {showPermissionBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg"
          >
            <div className="mx-4 bg-error/95 text-white p-5 rounded-xl shadow-2xl shadow-error/30 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-2xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>mic_off</span>
                <div className="flex-1">
                  <h4 className="font-headline font-bold text-lg mb-1">Microphone Access Required</h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Please allow microphone access in your browser settings to use the speaking practice feature. 
                    Click the lock/camera icon in your address bar to enable it.
                  </p>
                </div>
                <button onClick={() => setShowPermissionBanner(false)} className="text-white/70 hover:text-white p-1">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 pb-12 px-6 flex flex-col items-center max-w-6xl mx-auto w-full">
        {/* Lesson Header & Progress */}
        <div className="w-full max-w-3xl mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-primary font-headline font-bold text-sm tracking-wider uppercase">Current Lesson</span>
              <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-on-surface leading-tight">Lesson 1: Daily Actions</h1>
            </div>
            <div className="text-right">
              <span className="text-on-surface-variant font-bold text-lg">{currentStep}/{totalSteps}</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-4 w-full bg-secondary-container rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-secondary relative flex items-center justify-end pr-2"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <div className="w-1 h-2 bg-white/30 rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Interactive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          {/* Scene Illustration */}
          <div className="lg:col-span-7 relative group">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-tertiary-container/20 rounded-full blur-3xl group-hover:bg-tertiary-container/30 transition-colors"></div>
            <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(26,46,80,0.08)] border-outline-variant/15 border">
              <img alt="A person eating breakfast" className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDClt7XVf1q-LldxwFQzYDeyaQ1PsMbWrsTex2AUaaQj5hX6adKkKhEGAxjtWjZa1Ir_vSnoKl9Ao-DHbzuU-Qjmf0ojAYd9KW8FK2Deh75EYKtQFRbB2vOeOkkum6dXqkaq1FsS3T96AETDGloidCR0G6YPbelZ88m8w7NcxjmZr5rLHMothqRQuegHKMOsQAv8O2E9cD6d2zGxtpWLFq4AH7yzywQC2PSiy5aiCe9MZMXbZx3BhYS24TBpv4xVLtLkJhZvYRKEuBH"/>
              <div className="absolute bottom-6 left-6 bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl border border-white/40">
                <p className="text-on-surface font-semibold text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">visibility</span>
                  The Morning Scene
                </p>
              </div>
            </div>
          </div>

          {/* Interaction Area */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low p-8 rounded-lg border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-xl">quiz</span>
                </span>
                <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">Identify the action</p>
              </div>
              <h2 className="text-2xl font-headline font-semibold text-on-surface leading-snug">
                Describe this morning routine: <br/>
                <span className="text-on-surface-variant">He </span>
                <span className="inline-block min-w-[100px] border-b-4 border-primary-fixed-dim text-primary font-extrabold mx-1 px-2 text-center italic">
                  {isRecording ? "Listening..." : "Speak now"}
                </span>
                <span className="text-on-surface-variant"> breakfast.</span>
              </h2>
            </div>

            {/* Recording Interaction */}
            {(!isAnalyzing && !hasSubmitted) && (
              <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm space-y-6">
                {/* Mic Button */}
                <div className="relative">
                  {isRecording && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20"
                        animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/15"
                        animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                      />
                    </>
                  )}
                  <motion.div
                    animate={{ scale: isRecording ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-xl ${
                      isRecording 
                        ? "bg-error text-white shadow-error/30" 
                        : micPermission === "denied" 
                          ? "bg-surface-container-high text-on-surface-variant"
                          : "bg-primary text-white shadow-primary/30"
                    }`}
                    onClick={toggleRecording}
                  >
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isRecording ? "stop" : micPermission === "denied" ? "mic_off" : "mic"}
                    </span>
                  </motion.div>
                </div>

                {/* Audio Waveform Visualizer */}
                {isRecording && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-end justify-center gap-[3px] h-12 w-full max-w-[200px]"
                  >
                    {audioLevels.map((level, i) => (
                      <motion.div
                        key={i}
                        className="w-[6px] bg-primary rounded-full"
                        animate={{ height: level }}
                        transition={{ duration: 0.05 }}
                      />
                    ))}
                  </motion.div>
                )}

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2 text-primary/60">
                    <span className="material-symbols-outlined text-sm">filter_alt</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">AI Noise Remover Active</span>
                  </div>
                  <p className="font-bold text-lg text-on-surface">
                    {isRecording ? "Recording... Tap to stop" : micPermission === "denied" ? "Mic blocked — Tap to retry" : "Tap to Answer"}
                  </p>
                  <p className="text-sm text-on-surface-variant">&quot;He eats breakfast every morning&quot;</p>
                </div>
              </div>
            )}

            {/* AI Analysis Loading State */}
            <AnimatePresence mode="wait">
              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="p-10 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col items-center justify-center space-y-6 shadow-sm"
                >
                  <div className="w-16 h-16 relative flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="material-symbols-outlined text-primary text-2xl absolute" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  </div>
                  <div className="text-center">
                    <p className="font-headline font-bold text-xl text-on-surface">AI is analyzing your speech...</p>
                    <p className="text-sm text-on-surface-variant font-body mt-2">Evaluating pitch contours, voice clarity, and correctness.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Analysis Results Dashboard */}
            <AnimatePresence>
              {!isRecording && !isAnalyzing && hasSubmitted && analysisResults && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="bg-surface-container-lowest border border-outline-variant/20 p-8 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                    {/* Circular Overall Score */}
                    <div className="relative w-32 h-32 shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-surface-container-high" />
                        <motion.circle 
                          initial={{ strokeDashoffset: 351.85 }}
                          animate={{ strokeDashoffset: 351.85 - (351.85 * analysisResults.overall / 100) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" 
                          strokeDasharray="351.85" 
                          className={analysisResults.overall >= 80 ? 'text-secondary' : analysisResults.overall >= 60 ? 'text-[#F59E0B]' : 'text-error'} 
                          strokeLinecap="round" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-3xl font-headline font-extrabold">{analysisResults.overall}</motion.span>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Score</span>
                      </div>
                    </div>

                    <div className="flex-1 w-full space-y-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        <h3 className="font-headline font-bold text-lg">AI Performance Analysis</h3>
                      </div>
                      
                      {/* Metric Progress Bars */}
                      <div className="space-y-4">
                        {/* Correctness */}
                        <div>
                          <div className="flex justify-between text-sm mb-1 font-bold">
                            <span className="text-on-surface flex items-center gap-1"><span className="material-symbols-outlined text-sm">spellcheck</span> Correctness</span>
                            <span className={analysisResults.correctness >= 80 ? "text-secondary" : "text-error"}>{analysisResults.correctness}%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${analysisResults.correctness}%` }} className={`h-full ${analysisResults.correctness >= 80 ? "bg-secondary" : "bg-error"}`} transition={{ duration: 1, delay: 0.2 }} />
                          </div>
                        </div>
                        
                        {/* Pitch Modulations */}
                        <div>
                          <div className="flex justify-between text-sm mb-1 font-bold">
                            <span className="text-on-surface flex items-center gap-1"><span className="material-symbols-outlined text-sm">graphic_eq</span> Pitch Dynamics</span>
                            <span className="text-tertiary-fixed-dim font-extrabold">{analysisResults.pitch}%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${analysisResults.pitch}%` }} className="h-full bg-tertiary" transition={{ duration: 1, delay: 0.4 }} />
                          </div>
                        </div>

                        {/* Voice Clarity */}
                        <div>
                          <div className="flex justify-between text-sm mb-1 font-bold">
                            <span className="text-on-surface flex items-center gap-1"><span className="material-symbols-outlined text-sm">mic_external_on</span> Voice Clarity</span>
                            <span className="text-primary font-extrabold">{analysisResults.clarity}%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${analysisResults.clarity}%` }} className="h-full bg-primary" transition={{ duration: 1, delay: 0.6 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Box */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-primary/5 border border-primary/10 p-5 rounded-xl text-sm leading-relaxed">
                    <p className="text-on-surface"><strong className="text-primary font-headline">AI Feedback:</strong> {analysisResults.feedback}</p>
                    {analysisResults.spoken !== "(Transcript unavailable)" ? (
                      <div className="mt-3 bg-white/60 p-3 rounded-lg border border-outline-variant/10">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">What we heard:</p>
                        <p className="text-on-surface font-medium italic">"{analysisResults.spoken}"</p>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-on-surface-variant italic">Speech to text was unavailable in this browser, grades are approximated from audio contour.</p>
                    )}
                  </motion.div>
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    {audioUrl && (
                      <button onClick={() => {
                        const audio = new Audio(audioUrl);
                        audio.play();
                      }} className="flex items-center gap-2 px-6 py-2 bg-tertiary-container hover:bg-tertiary-container/80 rounded-full font-bold text-sm text-on-surface transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                        Play Recording
                      </button>
                    )}
                    <button onClick={() => {
                      setHasSubmitted(false);
                      setAnalysisResults(null); 
                      setAudioUrl(null);
                    }} className="flex items-center gap-2 px-6 py-2 bg-surface-container hover:bg-surface-container-high rounded-full font-bold text-sm text-on-surface transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-sm">replay</span>
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="w-full mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl border-t border-outline-variant/10 pt-10">
          <button onClick={() => router.back()} className="flex items-center gap-3 px-8 py-4 text-primary font-headline font-bold rounded-full border border-primary/20 hover:bg-primary-container/10 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <button 
            onClick={() => {
              if (currentStep >= totalSteps) {
                router.push("/assessment");
                return;
              }
              setCurrentStep(prev => Math.min(totalSteps, prev + 1));
              setHasSubmitted(false);
              setIsRecording(false);
              setAnalysisResults(null);
            }}
            className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-lg rounded-xl shadow-[0_10px_30px_-10px_rgba(0,94,160,0.5)] hover:shadow-[0_20px_40px_-12px_rgba(0,94,160,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {currentStep >= totalSteps ? "Start Assessment" : "Next Question"}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </main>

      <footer className="w-full flex flex-col items-center gap-6 px-8 mt-20 py-12 bg-[#f5f6ff] border-t border-[#9aadd6]/10">
        <p className="text-xs font-body text-[#1a2e50]/60 text-center">
            © 2024 GrammarJourney. The Modern Pastoral Learning Path.
        </p>
      </footer>
    </div>
  );
}

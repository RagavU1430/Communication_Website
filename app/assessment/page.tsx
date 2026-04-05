"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const ASSESSMENT_QUESTIONS = [
  { id: 1, question: "Complete: She ___ to the store every morning.", options: ["go", "goes", "going", "gone"], correct: 1 },
  { id: 2, question: "Which sentence is correct?", options: ["He don't like coffee.", "He doesn't likes coffee.", "He doesn't like coffee.", "He not like coffee."], correct: 2 },
  { id: 3, question: "Choose the right form: They ___ playing football right now.", options: ["is", "are", "was", "be"], correct: 1 },
  { id: 4, question: "Complete: I ___ breakfast at 8 AM yesterday.", options: ["eat", "eats", "ate", "eaten"], correct: 2 },
  { id: 5, question: "Which is the correct past tense?", options: ["She goed home.", "She went home.", "She wented home.", "She go home."], correct: 1 },
  { id: 6, question: "Complete: We will ___ the exam tomorrow.", options: ["taking", "took", "take", "takes"], correct: 2 },
  { id: 7, question: "Fill in: ___ you ever visited London?", options: ["Has", "Have", "Did", "Do"], correct: 1 },
  { id: 8, question: "Choose correctly: The children ___ in the garden.", options: ["is playing", "are playing", "plays", "am playing"], correct: 1 },
  { id: 9, question: "Complete: If it rains, I ___ stay home.", options: ["will", "would", "am", "do"], correct: 0 },
  { id: 10, question: "Which sentence uses the present perfect?", options: ["I ate lunch.", "I am eating lunch.", "I have eaten lunch.", "I eat lunch."], correct: 2 },
];

const MAX_TAB_SWITCHES = 3;
const ASSESSMENT_TIME_SECONDS = 600; // 10 minutes

export default function Assessment() {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();

  // Assessment states
  const [phase, setPhase] = useState<"intro" | "exam" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(ASSESSMENT_QUESTIONS.length).fill(null));
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ASSESSMENT_TIME_SECONDS);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const examContainerRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;
    if (timeLeft <= 0) { finishExam(); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  // Tab switch detection
  useEffect(() => {
    if (phase !== "exam") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const next = prev + 1;
          if (next >= MAX_TAB_SWITCHES) {
            // Auto-submit on 3rd switch
            setTimeout(() => finishExam(), 100);
          } else {
            setShowTabWarning(true);
          }
          return next;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [phase]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (err) {
      console.warn("Fullscreen not available:", err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Exit fullscreen error:", err);
    }
  }, []);

  const startExam = async () => {
    await enterFullscreen();
    setPhase("exam");
  };

  const selectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);
  };

  const finishExam = useCallback(async () => {
    // Calculate score
    let correct = 0;
    answers.forEach((ans, i) => {
      if (ans === ASSESSMENT_QUESTIONS[i].correct) correct++;
    });
    const finalScore = Math.round((correct / ASSESSMENT_QUESTIONS.length) * 100);
    setScore(finalScore);
    setPhase("result");
    await exitFullscreen();

    // Award badge if passed (>=60%)
    if (finalScore >= 60 && user) {
      try {
        await supabase.from("user_badges").upsert({
          user_id: user.id,
          badge_key: "level_1",
          earned_at: new Date().toISOString(),
        }, { onConflict: "user_id,badge_key" });
      } catch (err) {
        console.error("Badge award error:", err);
      }
    }
  }, [answers, user, supabase, exitFullscreen]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ---- INTRO SCREEN ----
  if (phase === "intro") {
    return (
      <div className="bg-surface font-body text-on-surface min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-surface-container-lowest rounded-2xl shadow-2xl p-10 md:p-16 text-center border border-outline-variant/10"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mb-4">Level 1 Assessment</h1>
          <p className="text-on-surface-variant text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Test your mastery of Present Tense. This timed exam has {ASSESSMENT_QUESTIONS.length} questions and will run in fullscreen mode.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto">
            <div className="bg-surface-container p-4 rounded-xl text-center">
              <p className="text-2xl font-headline font-extrabold text-primary">{ASSESSMENT_QUESTIONS.length}</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Questions</p>
            </div>
            <div className="bg-surface-container p-4 rounded-xl text-center">
              <p className="text-2xl font-headline font-extrabold text-secondary">{ASSESSMENT_TIME_SECONDS / 60}m</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Time Limit</p>
            </div>
            <div className="bg-surface-container p-4 rounded-xl text-center">
              <p className="text-2xl font-headline font-extrabold text-error">60%</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Pass Mark</p>
            </div>
          </div>

          <div className="bg-error-container/10 border border-error/20 rounded-xl p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-error mt-0.5">warning</span>
              <div>
                <p className="font-headline font-bold text-sm text-error mb-1">Exam Rules</p>
                <ul className="text-xs text-on-surface-variant space-y-1">
                  <li>•️ The exam will open in <strong>fullscreen mode</strong></li>
                  <li>• Switching tabs will trigger a <strong>warning</strong></li>
                  <li>• After <strong>{MAX_TAB_SWITCHES} tab switches</strong>, the exam auto-submits</li>
                  <li>• You cannot pause once started</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={startExam}
            className="px-12 py-5 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl text-xl font-headline font-bold shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            Begin Assessment
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="block mx-auto mt-4 text-on-surface-variant text-sm hover:text-primary transition-colors"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  // ---- EXAM SCREEN (Fullscreen) ----
  if (phase === "exam") {
    const q = ASSESSMENT_QUESTIONS[currentQ];
    const progress = ((currentQ + 1) / ASSESSMENT_QUESTIONS.length) * 100;
    const isLastQuestion = currentQ === ASSESSMENT_QUESTIONS.length - 1;

    return (
      <div ref={examContainerRef} className="bg-[#0D1B2A] text-white font-body min-h-screen flex flex-col">
        {/* Tab Switch Warning Modal */}
        <AnimatePresence>
          {showTabWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-[#1B2838] rounded-2xl p-10 max-w-md w-full text-center border border-error/30 shadow-2xl"
              >
                <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-error text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_maybe</span>
                </div>
                <h3 className="text-2xl font-headline font-bold text-white mb-3">Tab Switch Detected!</h3>
                <p className="text-white/70 mb-2 text-sm">
                  You have switched tabs <strong className="text-error">{tabSwitchCount}</strong> of <strong>{MAX_TAB_SWITCHES}</strong> allowed times.
                </p>
                <p className="text-white/50 mb-8 text-xs">
                  {tabSwitchCount >= MAX_TAB_SWITCHES - 1 
                    ? "One more switch and your exam will be auto-submitted!" 
                    : "Please stay on this tab to continue your exam."}
                </p>
                <button
                  onClick={() => setShowTabWarning(false)}
                  className="px-8 py-3 bg-error text-white rounded-xl font-bold hover:bg-error/80 transition-colors"
                >
                  I Understand, Continue
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exam Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-[#1B2838] border-b border-white/5">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">school</span>
            <h2 className="font-headline font-bold text-lg">Level 1 Assessment</h2>
          </div>
          <div className="flex items-center gap-6">
            {/* Tab switch indicator */}
            <div className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-sm text-white/50">tab</span>
              <span className={tabSwitchCount > 0 ? "text-error font-bold" : "text-white/50"}>
                {tabSwitchCount}/{MAX_TAB_SWITCHES}
              </span>
            </div>
            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
              timeLeft <= 60 ? "bg-error/20 text-error animate-pulse" : "bg-white/5 text-white/90"
            }`}>
              <span className="material-symbols-outlined text-lg">timer</span>
              {formatTime(timeLeft)}
            </div>
            {/* Question counter */}
            <div className="bg-white/5 px-4 py-2 rounded-lg text-sm font-bold">
              {currentQ + 1} / {ASSESSMENT_QUESTIONS.length}
            </div>
          </div>
        </header>

        {/* Progress bar */}
        <div className="h-1 w-full bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question Area */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl w-full"
            >
              <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">Question {currentQ + 1}</p>
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-white leading-tight mb-10">
                {q.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className={`p-6 rounded-xl text-left font-medium text-lg transition-all border-2 ${
                      answers[currentQ] === i
                        ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/20"
                        : "bg-[#1B2838] border-white/10 text-white/80 hover:border-white/30 hover:bg-white/5"
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 text-sm font-bold ${
                      answers[currentQ] === i ? "bg-primary text-white" : "bg-white/10 text-white/50"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Navigation */}
        <footer className="flex items-center justify-between px-8 py-6 bg-[#1B2838] border-t border-white/5">
          <button
            onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-2 px-6 py-3 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold rounded-lg"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Previous
          </button>

          {/* Question dots */}
          <div className="hidden md:flex items-center gap-2">
            {ASSESSMENT_QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentQ
                    ? "bg-primary scale-125"
                    : answers[i] !== null
                      ? "bg-secondary"
                      : "bg-white/20"
                }`}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <button
              onClick={finishExam}
              className="flex items-center gap-2 px-8 py-3 bg-secondary text-white rounded-xl font-bold shadow-lg shadow-secondary/30 hover:scale-105 transition-all"
            >
              Submit Exam
              <span className="material-symbols-outlined">check_circle</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentQ(prev => Math.min(ASSESSMENT_QUESTIONS.length - 1, prev + 1))}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-all"
            >
              Next
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
        </footer>
      </div>
    );
  }

  // ---- RESULTS SCREEN ----
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-surface-container-lowest rounded-2xl shadow-2xl p-10 md:p-16 text-center border border-outline-variant/10"
      >
        {/* Score Circle */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12" />
            <motion.circle
              initial={{ strokeDashoffset: 552.92 }}
              animate={{ strokeDashoffset: 552.92 - (552.92 * score / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={score >= 60 ? "text-secondary" : "text-error"}
              cx="96" cy="96" fill="transparent" r="88" stroke="currentColor"
              strokeDasharray="552.92" strokeWidth="12" strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-headline font-extrabold text-5xl text-on-surface"
            >
              {score}%
            </motion.span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {score >= 60 ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                <h2 className="text-3xl font-headline font-extrabold text-on-surface">Assessment Passed!</h2>
              </div>
              <p className="text-on-surface-variant text-lg mb-2">
                Congratulations! You have earned the <strong className="text-primary">First Steps</strong> badge.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-4">Keep Practicing!</h2>
              <p className="text-on-surface-variant text-lg mb-2">
                You need 60% to pass. Review the lessons and try again.
              </p>
            </>
          )}

          {tabSwitchCount > 0 && (
            <p className="text-error text-sm mt-2">
              Tab switches detected: {tabSwitchCount}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button
              onClick={() => router.push("/profile")}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-headline font-bold shadow-lg hover:scale-105 transition-all"
            >
              View Badges
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 border-2 border-outline-variant/20 text-on-surface rounded-xl font-headline font-bold hover:bg-surface-container-low transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, Sparkles, X, Globe } from "lucide-react";
import WaterDropEffect from "./WaterDropEffect";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show after a subtle delay to look professional
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem("rcoin_cse_seen");
      if (!hasSeen) {
        setIsOpen(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("rcoin_cse_seen", "true");
    setIsOpen(false);
  };

  const handleForceOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Small floating hint just in case they want to open it again wrapped in WaterDropEffect */}
      <WaterDropEffect
        id="btn-cse-hint"
        onClick={handleForceOpen}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-[#00E5FF] px-4 py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg text-xs font-medium cursor-pointer transition-all hover:scale-105 active:scale-95"
      >
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>CSE Blogs coming soon</span>
      </WaterDropEffect>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blurring effect */}
            <motion.div
              id="popup-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismiss}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Apple styled glassmorphism Card */}
            <motion.div
              id="popup-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#0F172A] to-[#020617] border border-blue-500/30 rounded-3xl p-6 shadow-2xl shadow-[#00e5ff]/10 overflow-hidden text-slate-100"
            >
              {/* Apple-like ambient lighting */}
              <div className="absolute top-0 left-1/4 w-1/2 h-20 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-[#00e5ff]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#00E5FF]/10 rounded-full border border-[#00E5FF]/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-bounce" />
                  <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider">RCoin Network Alert</span>
                </div>
                <button
                  id="welcome-dismiss-x"
                  onClick={handleDismiss}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-100 bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-4 items-start mb-6">
                <div className="p-3.5 bg-gradient-to-br from-blue-600 to-[#00E5FF] rounded-2xl shadow-indigo-500/20 shadow-lg shrink-0">
                  <Globe className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-white mb-1 font-sans">
                    CSE Blogs Coming Soon!
                  </h3>
                  <p className="text-xs text-[#00D4FF] font-medium tracking-wide">
                    Regional Market Expansion Scope
                  </p>
                </div>
              </div>

              <div className="bg-[#1E293B]/40 rounded-2xl p-4 border border-slate-800 text-slate-300 text-sm mb-6 leading-relaxed">
                We are proud to pre-announce that <strong className="text-white">Colombo Stock Exchange (CSE) market blogs</strong> will be integrated into the RCoin platform in the near future!
                <br />
                <br />
                This will bring real-time Colombo indices analysis, expert Sri Lankan financial newsletters, and regional macro-trends directly to your trading cockpit.
              </div>

              <div className="flex gap-3">
                <button
                  id="welcome-confirm-btn"
                  onClick={handleDismiss}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-[#00E5FF] hover:to-indigo-500 text-slate-900 hover:text-slate-950 rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/20 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  Enter RCoin Console
                </button>
              </div>
              
              <div className="mt-4 text-[10px] text-center text-slate-500 font-mono">
                RCoin Ledger Protocol &copy; 2026
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

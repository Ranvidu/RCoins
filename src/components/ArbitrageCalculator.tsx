import React, { useState, useEffect } from "react";
import { TickerData } from "../types";
import { Coins, ArrowRightLeft, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";

interface ArbitrageCalculatorProps {
  tickerData: TickerData | null;
}

export default function ArbitrageCalculator({ tickerData }: ArbitrageCalculatorProps) {
  // Converter States
  const [conversionAmount, setConversionAmount] = useState<string>("1");
  const [selectedSource, setSelectedSource] = useState<"BTC" | "USD" | "USDT" | "LKR">("BTC");
  
  // Simulated Wallet States
  const [portfolio, setPortfolio] = useState({
    BTC: 0.15,
    USDT: 5000,
    LKR: 350000
  });
  
  // Trade Inputs
  const [tradeAction, setTradeAction] = useState<"BUY" | "SELL">("BUY");
  const [tradeAmount, setTradeAmount] = useState<string>("1000");
  const [tradeAsset, setTradeAsset] = useState<"BTC">("BTC");
  const [tradeCurrency, setTradeCurrency] = useState<"USDT" | "LKR">("USDT");
  const [tradeLog, setTradeLog] = useState<{ id: string; type: string; details: string; time: string }[]>([]);

  // Prices
  const prices = tickerData?.prices || {
    "BTC/USD": 96420.50,
    "BTC/USDT": 96320.00,
    "USD/LKR": 300.50,
    "BTC/LKR": 28974360.25
  };

  // Convert Function
  const calculateResult = (sourceVal: number, from: typeof selectedSource, target: typeof selectedSource): string => {
    if (isNaN(sourceVal) || sourceVal <= 0) return "0.00";
    
    // Convert source to USD baseline
    let valueInUsd = 0;
    if (from === "BTC") {
      valueInUsd = sourceVal * prices["BTC/USD"];
    } else if (from === "USDT") {
      valueInUsd = sourceVal; // 1 USDT = 1 USD
    } else if (from === "USD") {
      valueInUsd = sourceVal;
    } else if (from === "LKR") {
      valueInUsd = sourceVal / prices["USD/LKR"];
    }

    // Convert USD baseline to target
    if (target === "BTC") {
      return (valueInUsd / prices["BTC/USD"]).toFixed(6);
    } else if (target === "USDT") {
      return valueInUsd.toFixed(2);
    } else if (target === "USD") {
      return valueInUsd.toFixed(2);
    } else if (target === "LKR") {
      return (valueInUsd * prices["USD/LKR"]).toFixed(2);
    }
    return "0.00";
  };

  // Calculate Net Value of Simulated Wallet
  const btcInUsd = portfolio.BTC * prices["BTC/USD"];
  const usdtInUsd = portfolio.USDT;
  const lkrInUsd = portfolio.LKR / prices["USD/LKR"];
  const totalInUsd = btcInUsd + usdtInUsd + lkrInUsd;
  const totalInLkr = totalInUsd * prices["USD/LKR"];

  // Execute Simulated Trade
  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (tradeAction === "BUY") {
      // Buying BTC with either USDT or LKR
      if (tradeCurrency === "USDT") {
        if (portfolio.USDT < amount) {
          alert("Insufficient simulated USDT balance.");
          return;
        }
        const btcBought = amount / prices["BTC/USDT"];
        setPortfolio({
          ...portfolio,
          USDT: +(portfolio.USDT - amount).toFixed(2),
          BTC: +(portfolio.BTC + btcBought).toFixed(6),
        });
        setTradeLog(prev => [
          {
            id: Math.random().toString(),
            type: "BUY",
            details: `Exchanged ${amount} USDT for ${btcBought.toFixed(6)} BTC`,
            time: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      } else {
        if (portfolio.LKR < amount) {
          alert("Insufficient simulated LKR balance.");
          return;
        }
        const btcBought = amount / prices["BTC/LKR"];
        setPortfolio({
          ...portfolio,
          LKR: +(portfolio.LKR - amount).toFixed(2),
          BTC: +(portfolio.BTC + btcBought).toFixed(6),
        });
        setTradeLog(prev => [
          {
            id: Math.random().toString(),
            type: "BUY",
            details: `Exchanged ${amount.toLocaleString()} LKR for ${btcBought.toFixed(6)} BTC`,
            time: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      }
    } else {
      // SELLING BTC for either USDT or LKR
      const btcNeeded = tradeCurrency === "USDT" ? amount / prices["BTC/USDT"] : amount / prices["BTC/LKR"];
      if (portfolio.BTC < btcNeeded) {
        alert("Insufficient simulated BTC balance.");
        return;
      }
      if (tradeCurrency === "USDT") {
        setPortfolio({
          ...portfolio,
          BTC: +(portfolio.BTC - btcNeeded).toFixed(6),
          USDT: +(portfolio.USDT + amount).toFixed(2),
        });
        setTradeLog(prev => [
          {
            id: Math.random().toString(),
            type: "SELL",
            details: `Exchanged ${btcNeeded.toFixed(6)} BTC for ${amount} USDT`,
            time: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      } else {
        setPortfolio({
          ...portfolio,
          BTC: +(portfolio.BTC - btcNeeded).toFixed(6),
          LKR: +(portfolio.LKR + amount).toFixed(2),
        });
        setTradeLog(prev => [
          {
            id: Math.random().toString(),
            type: "SELL",
            details: `Exchanged ${btcNeeded.toFixed(6)} BTC for ${amount.toLocaleString()} LKR`,
            time: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1 border-b border-white/5 pb-5">
        <h2 className="text-3xl font-semibold tracking-tight text-white font-sans">
          Exchange & Trading Sandbox
        </h2>
        <p className="text-sm text-slate-400">
          Seamlessly calculate relative valuations or run simulated asset transactions with real-time markets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Converter Column */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <ArrowRightLeft className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Advanced Conversion Matrix</h3>
              <p className="text-xs text-slate-400">All conversions map to active feed prices</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Input Valuation</label>
              <div className="flex">
                <input
                  type="number"
                  value={conversionAmount}
                  onChange={(e) => setConversionAmount(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 rounded-l-2xl px-4 py-3.5 focus:outline-none focus:border-blue-500/60 text-white font-medium placeholder-slate-600"
                  placeholder="0.00"
                />
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value as any)}
                  className="bg-slate-950 border border-y-slate-800 border-r-slate-800 rounded-r-2xl border-l-0 px-4 py-3.5 text-blue-400 font-bold focus:outline-none"
                >
                  <option value="BTC">BTC</option>
                  <option value="USD">USD</option>
                  <option value="USDT">USDT</option>
                  <option value="LKR">LKR</option>
                </select>
              </div>
            </div>

            {/* Conversion Display Cards */}
            <div className="space-y-3 pt-3">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">Calculated Equivalence</label>
              
              {/* Card 1 */}
              {selectedSource !== "BTC" && (
                <div className="flex justify-between items-center bg-slate-950/75 border border-slate-900 rounded-2xl p-4">
                  <span className="text-xs text-slate-400 font-mono">BTC Balance</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {calculateResult(parseFloat(conversionAmount), selectedSource, "BTC")} <span className="text-blue-400 text-xs text-bold">RC-BTC</span>
                  </span>
                </div>
              )}

              {/* Card 2 */}
              {selectedSource !== "USDT" && (
                <div className="flex justify-between items-center bg-slate-950/75 border border-slate-900 rounded-2xl p-4">
                  <span className="text-xs text-slate-400 font-mono">Tether Address (USDT)</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    ${parseFloat(calculateResult(parseFloat(conversionAmount), selectedSource, "USDT")).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Card 3 */}
              {selectedSource !== "USD" && (
                <div className="flex justify-between items-center bg-slate-950/75 border border-slate-900 rounded-2xl p-4">
                  <span className="text-xs text-slate-400 font-mono">Fiat Account (USD)</span>
                  <span className="text-lg font-bold text-sky-400 font-mono">
                    ${parseFloat(calculateResult(parseFloat(conversionAmount), selectedSource, "USD")).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Card 4 */}
              {selectedSource !== "LKR" && (
                <div className="flex justify-between items-center bg-slate-950/75 border border-slate-900 rounded-2xl p-4">
                  <span className="text-xs text-slate-400 font-mono">SriLankan Rupee (LKR)</span>
                  <span className="text-lg font-bold text-indigo-400 font-mono text-right">
                    ₨ {parseFloat(calculateResult(parseFloat(conversionAmount), selectedSource, "LKR")).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Sandbox Column */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Simulated Assets Metrics */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <Wallet className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Fictitious Wallet Portfolio</h3>
                  <p className="text-xs text-slate-400">Trade test assets instantly at live prices</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">Total Portfolio Value</span>
                <div className="text-2xl font-bold text-white font-mono">
                  ${totalInUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  ₨ {totalInLkr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LKR
                </div>
              </div>
            </div>

            {/* Wallet Balances Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl">
                <div className="text-slate-500 text-xs font-medium mb-1 font-mono">BTC Balance</div>
                <div className="text-lg font-bold text-white font-mono">{portfolio.BTC} <span className="text-[#00E5FF] text-xs">BTC</span></div>
                <div className="text-xs text-[#00E5FF] font-mono mt-1">${(portfolio.BTC * prices["BTC/USD"]).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              
              <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl">
                <div className="text-slate-500 text-xs font-medium mb-1 font-mono">USDT Balance</div>
                <div className="text-lg font-bold text-white font-mono">${portfolio.USDT.toLocaleString()} <span className="text-emerald-400 text-xs">USDT</span></div>
                <div className="text-xs text-emerald-400 font-mono mt-1">${portfolio.USDT.toLocaleString()}</div>
              </div>

              <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl">
                <div className="text-slate-500 text-xs font-medium mb-1 font-mono">LKR Balance</div>
                <div className="text-lg font-bold text-white font-mono">₨ {portfolio.LKR.toLocaleString()} <span className="text-indigo-400 text-xs">LKR</span></div>
                <div className="text-xs text-indigo-400 font-mono mt-1">${(portfolio.LKR / prices["USD/LKR"]).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
            </div>

            {/* Transaction Form inside */}
            <form onSubmit={handleExecuteTrade} className="bg-[#020617]/50 rounded-2xl p-4 border border-slate-800">
              <h4 className="text-xs font-bold text-[#00E5FF] tracking-wider uppercase mb-3">Execute Instant simulated Trade</h4>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                
                {/* Buy / Sell Buttons */}
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Action</label>
                  <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
                    <button
                      id="sim-action-buy"
                      type="button"
                      onClick={() => setTradeAction("BUY")}
                      className={`w-full py-1.5 text-xs font-bold rounded-lg ${tradeAction === "BUY" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "text-slate-400"}`}
                    >
                      Buy
                    </button>
                    <button
                      id="sim-action-sell"
                      type="button"
                      onClick={() => setTradeAction("SELL")}
                      className={`w-full py-1.5 text-xs font-bold rounded-lg ${tradeAction === "SELL" ? "bg-rose-500/10 border border-rose-500/30 text-rose-400" : "text-slate-400"}`}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                {/* Amount to Trade */}
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Trade Size in base</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Amount"
                    />
                  </div>
                </div>

                {/* Currency Base selection */}
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Currency Base</label>
                  <select
                    value={tradeCurrency}
                    onChange={(e) => setTradeCurrency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-indigo-400 font-bold focus:outline-none"
                  >
                    <option value="USDT">USDT (Tether)</option>
                    <option value="LKR">LKR (Rupee)</option>
                  </select>
                </div>

                {/* Submit button */}
                <div className="sm:col-span-2">
                  <button
                    id="sim-trade-execute-button"
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-[#00E5FF] hover:to-indigo-500 text-slate-900 font-bold rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-[0.97]"
                  >
                    Confirm
                  </button>
                </div>

              </div>
              <div className="text-[10px] text-slate-500 text-right mt-2 italic font-mono">
                Trading maps directly to {tradeCurrency === "USDT" ? `BTC/USDT @ ₨${prices["BTC/USDT"].toLocaleString()}` : `BTC/LKR @ ₨${prices["BTC/LKR"].toLocaleString()}`}
              </div>
            </form>

            {/* Simulated Trade Log */}
            {tradeLog.length > 0 && (
              <div className="mt-5 border-t border-slate-800 pt-4">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Simulated Ledger Registry</h5>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                  {tradeLog.map(log => (
                    <div key={log.id} className="flex justify-between items-center bg-slate-950 text-[11px] p-2 rounded-lg border border-slate-900 font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${log.type === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                        {log.type}
                      </span>
                      <span className="text-slate-300 mx-2 flex-grow text-left truncate">{log.details}</span>
                      <span className="text-slate-500 font-sans">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

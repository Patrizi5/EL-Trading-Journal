import React from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import PositionCalculator from '../components/calculator/PositionCalculator';

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 rounded-xl bg-emerald-500/10">
            <Calculator className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Position Calculator</h1>
            <p className="text-slate-400 mt-1">Calculate optimal position size and risk</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PositionCalculator />
        </motion.div>

        {/* Educational Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid md:grid-cols-2 gap-6"
        >
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <h3 className="text-white font-semibold mb-3">Risk Management Tips</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Never risk more than 1-2% of your account per trade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Always use a stop loss to define your risk</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Aim for a minimum 2:1 risk/reward ratio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>Size your positions based on volatility</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <h3 className="text-white font-semibold mb-3">How to Use</h3>
            <ol className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">1.</span>
                <span>Enter your total account size</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">2.</span>
                <span>Set your risk percentage (typically 1-2%)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">3.</span>
                <span>Input your entry price and stop loss</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">4.</span>
                <span>Add take profit to see risk/reward ratio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">5.</span>
                <span>The calculator shows your ideal position size</span>
              </li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import React from 'react';
import { Compass, BookOpen, Shield, Code, Heart, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <footer className="bg-charcoal-900 text-cream-200 border-t border-charcoal-800 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & College */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-peach-500 text-white flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-sans">
                Campus<span className="text-peach-400">Find</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              A modern, intelligent Lost & Found Management System designed for college campuses.
              Demonstrates practical implementation of Software Engineering Lab Experiments 1 through 10.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-charcoal-800 border border-charcoal-700 px-3 py-1.5 rounded-lg text-xs text-cream-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SVKM's NMIMS MPSTME • Computer Engineering Dept</span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Project Contributors
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-peach-400 font-bold text-xs bg-peach-950/60 border border-peach-800/60 px-1.5 py-0.5 rounded">
                  N022
                </span>
                <span>Tanay Dekate</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-peach-400 font-bold text-xs bg-peach-950/60 border border-peach-800/60 px-1.5 py-0.5 rounded">
                  N026
                </span>
                <span>Jivitesh Dutt</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-peach-400 font-bold text-xs bg-peach-950/60 border border-peach-800/60 px-1.5 py-0.5 rounded">
                  N038
                </span>
                <span>Gatha Jain</span>
              </li>
              <li className="text-xs text-gray-400 pt-1">
                Program: MBA Tech CE (Div D / Batch D1)
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              System Modules
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => navigate('/browse')}
                  className="hover:text-peach-400 transition-colors"
                >
                  Search & Browse Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/report-lost')}
                  className="hover:text-peach-400 transition-colors"
                >
                  Report Lost Belonging
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/report-found')}
                  className="hover:text-peach-400 transition-colors"
                >
                  Report Found Property
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/experiments')}
                  className="text-peach-400 font-medium hover:underline flex items-center gap-1"
                >
                  <span>Experiments 1–10 Showcase</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 CampusFind. Built for NMIMS MPSTME Software Engineering Evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>SQLite 3NF Normalized</span>
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>TCL/DCL & MongoDB CRUD Lab Ready</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from "react";
import { Layers } from "lucide-react";
import { SYSTEM_ARCHITECTURE_LAYERS } from "./homeData";

/* --- Enhanced 3D-Style Graphic Illustrations for Architecture Stages --- */

function Factory3DIcon() {
  return (
    <svg className="w-[66px] h-[44px] drop-shadow-md select-none transition-transform duration-200" viewBox="0 0 72 50" fill="none">
      <defs>
        <linearGradient id="facRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="facWall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="facSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="facChimney" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* 3D Smokestacks */}
      <rect x="15" y="6" width="6.5" height="20" rx="1.5" fill="url(#facChimney)" />
      <rect x="25" y="11" width="5.5" height="15" rx="1.5" fill="url(#facChimney)" />
      {/* Smoke puffs */}
      <circle cx="18" cy="3" r="2.5" fill="#e2e8f0" fillOpacity="0.85" />
      <circle cx="21" cy="1" r="2" fill="#f1f5f9" fillOpacity="0.7" />
      {/* Main Factory Front & Sawtooth Roofs */}
      <polygon points="10,22 21,15 21,22 32,15 32,22 43,15 43,45 10,45" fill="url(#facRoof)" />
      {/* 3D Side extrusion */}
      <polygon points="43,15 56,22 56,43 43,45" fill="url(#facSide)" />
      {/* Front wall plate */}
      <rect x="14" y="27" width="25" height="15" rx="1.5" fill="url(#facWall)" />
      {/* Windows / Bays */}
      <rect x="17" y="31" width="4.5" height="4.5" rx="1" fill="#0284c7" />
      <rect x="24" y="31" width="4.5" height="4.5" rx="1" fill="#0284c7" />
      <rect x="31" y="31" width="4.5" height="4.5" rx="1" fill="#0284c7" />
      {/* Ground shadow */}
      <ellipse cx="33" cy="46" rx="24" ry="2.5" fill="#0f172a" fillOpacity="0.15" />
    </svg>
  );
}

function Cloud3DIcon() {
  return (
    <svg className="w-[66px] h-[44px] drop-shadow-md select-none transition-transform duration-200" viewBox="0 0 72 50" fill="none">
      <defs>
        <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e0e7ff" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </linearGradient>
        <linearGradient id="cloudGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="badgeGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Soft Ground Shadow */}
      <ellipse cx="32" cy="44" rx="22" ry="3" fill="#312e81" fillOpacity="0.15" />
      {/* Cloud Backing Depth */}
      <path
        d="M18 38h28a11 11 0 0 0 2.5-21.8 14 14 0 0 0-27-2.9A11 11 0 0 0 18 38z"
        fill="url(#cloudGlow)"
        opacity="0.3"
        transform="translate(1, 1.5)"
      />
      {/* Main 3D Volumetric Cloud */}
      <path
        d="M17 37h28a11 11 0 0 0 2.5-21.8 14 14 0 0 0-27-2.9A11 11 0 0 0 17 37z"
        fill="url(#cloudGrad)"
      />
      {/* Upward Ingestion Arrow */}
      <path
        d="M31 34V22M31 22L27 26M31 22L35 26"
        stroke="#4f46e5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 3D Checkmark Shield Badge */}
      <g transform="translate(42, 22)">
        <circle cx="8" cy="8" r="8" fill="url(#badgeGreen)" />
        <circle cx="8" cy="8" r="7" fill="none" stroke="#a7f3d0" strokeWidth="1" />
        <path d="M5 8.2L7.2 10.4L11.5 5.8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function Chip3DIcon() {
  return (
    <svg className="w-[66px] h-[44px] drop-shadow-lg select-none transition-transform duration-200" viewBox="0 0 72 50" fill="none">
      <defs>
        <linearGradient id="chipTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="35%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
        <linearGradient id="chipPins" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Soft Shadow */}
      <ellipse cx="36" cy="45" rx="20" ry="3" fill="#1e1b4b" fillOpacity="0.5" />
      {/* 3D Pins Left & Right */}
      <rect x="15" y="14" width="4.5" height="2.5" rx="0.8" fill="url(#chipPins)" />
      <rect x="15" y="21" width="4.5" height="2.5" rx="0.8" fill="url(#chipPins)" />
      <rect x="15" y="28" width="4.5" height="2.5" rx="0.8" fill="url(#chipPins)" />
      <rect x="52.5" y="14" width="4.5" height="2.5" rx="0.8" fill="url(#chipPins)" />
      <rect x="52.5" y="21" width="4.5" height="2.5" rx="0.8" fill="url(#chipPins)" />
      <rect x="52.5" y="28" width="4.5" height="2.5" rx="0.8" fill="url(#chipPins)" />
      {/* 3D Pins Top & Bottom */}
      <rect x="25" y="6" width="2.5" height="4.5" rx="0.8" fill="url(#chipPins)" />
      <rect x="34" y="6" width="2.5" height="4.5" rx="0.8" fill="url(#chipPins)" />
      <rect x="43" y="6" width="2.5" height="4.5" rx="0.8" fill="url(#chipPins)" />
      <rect x="25" y="36.5" width="2.5" height="4.5" rx="0.8" fill="url(#chipPins)" />
      <rect x="34" y="36.5" width="2.5" height="4.5" rx="0.8" fill="url(#chipPins)" />
      <rect x="43" y="36.5" width="2.5" height="4.5" rx="0.8" fill="url(#chipPins)" />
      {/* Main Chip Outer Bevel */}
      <rect x="18" y="9" width="36" height="29" rx="5" fill="#3b0764" />
      {/* Chip Top Face with Gradient */}
      <rect x="19" y="10" width="34" height="26.5" rx="4" fill="url(#chipTop)" />
      {/* Circuit lines */}
      <path d="M22 15H25V18M49 15H46V18M22 31H25V28M49 31H46V28" stroke="#f3e8ff" strokeWidth="1" strokeLinecap="round" />
      {/* Central Glowing AI Core */}
      <rect x="28" y="15" width="16" height="16" rx="2.5" fill="#3b0764" stroke="#e9d5ff" strokeWidth="1" />
      <circle cx="36" cy="23" r="6" fill="url(#aiGlow)" />
      <text x="36" y="26.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
        AI
      </text>
    </svg>
  );
}

function Database3DIcon() {
  return (
    <svg className="w-[66px] h-[44px] drop-shadow-md select-none transition-transform duration-200" viewBox="0 0 72 50" fill="none">
      <defs>
        <linearGradient id="dbTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="dbCylinder" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="40%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="dbBadge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Ground Shadow */}
      <ellipse cx="34" cy="45" rx="18" ry="3" fill="#1e293b" fillOpacity="0.15" />
      {/* Cylinder Layer 3 (Bottom) */}
      <path d="M22 28 C22 24.5 46 24.5 46 28 V34 C46 37.5 22 37.5 22 34 Z" fill="url(#dbCylinder)" />
      <ellipse cx="34" cy="34" rx="12" ry="3.5" fill="url(#dbTop)" />
      {/* Cylinder Layer 2 (Middle) */}
      <path d="M22 19 C22 15.5 46 15.5 46 19 V25 C46 28.5 22 28.5 22 25 Z" fill="url(#dbCylinder)" />
      <ellipse cx="34" cy="25" rx="12" ry="3.5" fill="url(#dbTop)" />
      {/* Cylinder Layer 1 (Top) */}
      <path d="M22 10 C22 6.5 46 6.5 46 10 V16 C46 19.5 22 19.5 22 16 Z" fill="url(#dbCylinder)" />
      <ellipse cx="34" cy="10" rx="12" ry="3.5" fill="url(#dbTop)" />
      {/* 3D Checkmark Shield Badge */}
      <g transform="translate(41, 20)">
        <circle cx="8" cy="8" r="8" fill="url(#dbBadge)" />
        <circle cx="8" cy="8" r="7" fill="none" stroke="#a7f3d0" strokeWidth="1" />
        <path d="M5 8.2L7.2 10.4L11.5 5.8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function Analytics3DIcon() {
  return (
    <svg className="w-[66px] h-[44px] drop-shadow-md select-none transition-transform duration-200" viewBox="0 0 72 50" fill="none">
      <defs>
        <linearGradient id="monFrame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="barYellow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="36" cy="46" rx="20" ry="2.5" fill="#0f172a" fillOpacity="0.15" />
      {/* Stand Base & Neck */}
      <path d="M30 42 L42 42 L38 34 L34 34 Z" fill="#64748b" />
      <ellipse cx="36" cy="42" rx="8" ry="2" fill="#475569" />
      {/* Monitor Outer Frame */}
      <rect x="15" y="7" width="42" height="28" rx="3.5" fill="url(#monFrame)" />
      {/* Monitor Inner Screen */}
      <rect x="17" y="9" width="38" height="24" rx="2" fill="url(#screenGrad)" />
      {/* 3D Bar Charts on Screen */}
      <rect x="21" y="21" width="5" height="9" rx="1.2" fill="url(#barBlue)" />
      <rect x="29" y="16" width="5" height="14" rx="1.2" fill="url(#barYellow)" />
      <rect x="37" y="13" width="5" height="17" rx="1.2" fill="url(#barGreen)" />
      <rect x="45" y="18" width="5" height="12" rx="1.2" fill="url(#barBlue)" />
      {/* Rising Trendline */}
      <path d="M20 23 L28 18 L36 14 L46 16" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="46" cy="16" r="1.5" fill="#ffffff" />
    </svg>
  );
}

export default function CompactArchitectureOverview({
  selectedLayerId,
  onSelectLayer,
}) {
  const activeLayerId = selectedLayerId || "layer-3-intelligence";

  return (
    <div className="w-full h-full bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-3.5 shadow-2xs flex flex-col justify-between relative">
      {/* Header - Clean */}
      <div className="flex items-center justify-between pb-2 sm:pb-2.5 border-b border-slate-100 dark:border-slate-800 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6f3dba] dark:text-purple-300 flex items-center justify-center font-bold shadow-2xs shrink-0">
            <Layers className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <h2 className="text-xs sm:text-sm font-extrabold text-[#1f2f59] dark:text-slate-100 tracking-tight">
            Manufacturing Intelligence Architecture
          </h2>
        </div>
      </div>

      {/* 5 Connected Architecture Columns - No Arrows */}
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3 flex-1 my-2 items-stretch relative">
        {SYSTEM_ARCHITECTURE_LAYERS.map((layer) => {
          const isSelected = activeLayerId === layer.id;
          const isCentral = layer.isCentralStage;

          return (
            <button
              key={layer.id}
              data-stage-id={layer.id}
              onClick={() => onSelectLayer && onSelectLayer(layer)}
              className={`relative flex flex-col rounded-xl transition-all duration-200 cursor-pointer p-2 sm:p-2.5 select-none justify-between text-left group ${
                isCentral
                  ? "bg-gradient-to-b from-[#4c1d95] via-[#5b21b6] to-[#3b0764] text-white shadow-lg shadow-purple-900/30 ring-2 ring-purple-400/90 z-10"
                  : isSelected
                  ? "bg-purple-50/80 dark:bg-purple-950/50 border-2 border-[#6f3dba] shadow-xs ring-1 ring-purple-500/30"
                  : "bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-white dark:hover:bg-slate-800 shadow-2xs"
              }`}
            >
              {/* Card Top: Distinct Circular Number Badge and Bold Title */}
              <div className="flex items-center gap-2 pb-1.5 border-b border-black/5 dark:border-white/10 shrink-0">
                <span
                  className={`w-5 h-5 min-w-[20px] aspect-square rounded-full flex items-center justify-center text-[10.5px] font-mono font-black shrink-0 shadow-xs ${
                    isCentral
                      ? "bg-white text-[#4c1d95] shadow-sm"
                      : layer.layerNum === 1
                      ? "bg-[#0284c7] text-white"
                      : layer.layerNum === 2
                      ? "bg-[#9333ea] text-white"
                      : layer.layerNum === 4
                      ? "bg-[#2563eb] text-white"
                      : "bg-[#059669] text-white"
                  }`}
                >
                  {layer.layerNum}
                </span>
                <span
                  className={`text-xs sm:text-[12.5px] font-black tracking-tight leading-snug block ${
                    isCentral ? "text-white" : "text-slate-800 dark:text-slate-100"
                  }`}
                >
                  {layer.name}
                </span>
              </div>

              {/* Highlighted 3D Asset Image Pedestal Container */}
              <div className="w-full flex items-center justify-center py-1.5 shrink-0">
                <div
                  className={`w-full h-[52px] rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-102 group-hover:shadow-sm ${
                    isCentral
                      ? "bg-gradient-to-b from-purple-800/70 via-purple-700/50 to-purple-950/80 border border-purple-400/40 shadow-inner shadow-purple-950/40"
                      : layer.layerNum === 1
                      ? "bg-gradient-to-b from-sky-50 via-blue-50/60 to-blue-100/50 dark:from-sky-950/30 dark:to-blue-900/20 border border-blue-200/70 dark:border-blue-800/50 shadow-2xs"
                      : layer.layerNum === 2
                      ? "bg-gradient-to-b from-purple-50 via-indigo-50/60 to-purple-100/50 dark:from-purple-950/30 dark:to-indigo-900/20 border border-purple-200/70 dark:border-purple-800/50 shadow-2xs"
                      : layer.layerNum === 4
                      ? "bg-gradient-to-b from-indigo-50 via-blue-50/60 to-indigo-100/50 dark:from-indigo-950/30 dark:to-blue-900/20 border border-indigo-200/70 dark:border-indigo-800/50 shadow-2xs"
                      : "bg-gradient-to-b from-emerald-50 via-teal-50/60 to-emerald-100/50 dark:from-emerald-950/30 dark:to-teal-900/20 border border-emerald-200/70 dark:border-emerald-800/50 shadow-2xs"
                  }`}
                >
                  {layer.layerNum === 1 && <Factory3DIcon />}
                  {layer.layerNum === 2 && <Cloud3DIcon />}
                  {layer.layerNum === 3 && <Chip3DIcon />}
                  {layer.layerNum === 4 && <Database3DIcon />}
                  {layer.layerNum === 5 && <Analytics3DIcon />}
                </div>
              </div>

              {/* Internal Component Chips - Compact & Refined */}
              <div className="flex flex-col gap-1 flex-1 justify-evenly my-0.5">
                {layer.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className={`px-2 py-1 rounded-md text-[9.5px] sm:text-[10px] font-bold leading-tight flex items-center justify-between transition-colors shadow-2xs ${
                      isCentral
                        ? "bg-purple-900/60 hover:bg-purple-800/80 text-purple-100 border border-purple-400/30"
                        : "bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 hover:border-purple-300"
                    }`}
                  >
                    <span className="leading-snug">{item.name}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

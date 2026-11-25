import React from "react";
import {
  Flame,
  TrendingUp,
  Boxes,
  ShieldAlert,
  Cog,
  FlaskConical,
  ChevronRight,
} from "lucide-react";
import { MANUFACTURING_PROBLEMS } from "./homeData";

const PROBLEM_CONFIG = {
  "prob-01": {
    icon: TrendingUp,
    numColor: "text-[#C8190F]",
    iconColor: "text-[#C8190F]",
    bg: "bg-[#FDECEC]",
    border: "border-[#FCA5A5]",
    chevronColor: "text-[#C8190F]",
  },
  "prob-02": {
    icon: Boxes,
    numColor: "text-[#D97706]",
    iconColor: "text-[#D97706]",
    bg: "bg-[#FFF6D6]",
    border: "border-[#FDE047]",
    chevronColor: "text-[#D97706]",
  },
  "prob-03": {
    icon: ShieldAlert,
    numColor: "text-[#9333EA]",
    iconColor: "text-[#9333EA]",
    bg: "bg-[#FDEEF3]",
    border: "border-[#F472B6]",
    chevronColor: "text-[#9333EA]",
  },
  "prob-04": {
    icon: Cog,
    numColor: "text-[#0284C7]",
    iconColor: "text-[#0284C7]",
    bg: "bg-[#E6F3FF]",
    border: "border-[#7DD3FC]",
    chevronColor: "text-[#0284C7]",
  },
  "prob-05": {
    icon: FlaskConical,
    numColor: "text-[#C8190F]",
    iconColor: "text-[#C8190F]",
    bg: "bg-[#FDECEC]",
    border: "border-[#FCA5A5]",
    chevronColor: "text-[#C8190F]",
  },
};

export default function ManufacturingProblemsPanel({
  selectedId,
  selectedProblemId,
  onSelect,
  onSelectProblem,
}) {
  const currentSelection = selectedId || selectedProblemId;

  return (
    <div className="w-full h-full bg-white rounded-[16px] border border-[#E3E6F3] p-2.5 xl:p-3 shadow-[0_2px_8px_rgba(40,40,100,0.06)] flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center pb-2 border-b border-[#F0F2FA] shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-[6px] bg-red-100 text-[#C8190F] flex items-center justify-center shrink-0">
            <Flame className="w-3 h-3 stroke-[2.4]" />
          </div>
          <h2 className="text-[12px] xl:text-[13px] font-bold text-[#1E1B3A] tracking-tight truncate">
            Manufacturing Problems
          </h2>
        </div>
      </div>

      {/* 5 Problem Cards */}
      <div className="flex flex-col gap-2 xl:gap-2.5 flex-1 pt-2 min-h-0">
        {MANUFACTURING_PROBLEMS.map((prob) => {
          const isSelected = currentSelection === prob.id;
          const conf = PROBLEM_CONFIG[prob.id] || PROBLEM_CONFIG["prob-01"];
          const IconComp = conf.icon;

          const handleClick = () => {
            if (onSelect) {
              onSelect(prob.id);
            } else if (onSelectProblem) {
              onSelectProblem(prob);
            }
          };

          return (
            <div
              key={prob.id}
              onClick={handleClick}
              className={`flex-1 flex items-center justify-between px-3 py-2 rounded-[10px] border transition-all cursor-pointer shadow-2xs ${conf.bg
                } ${conf.border} ${isSelected
                  ? "ring-2 ring-red-500 shadow-md scale-[1.01]"
                  : "hover:brightness-98 hover:shadow-xs"
                }`}
              title={`Click to view ${prob.title} investigation details`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <span className={`text-[11.5px] font-extrabold ${conf.numColor} shrink-0`}>
                  {prob.num}
                </span>
                <div className="w-8 h-8 rounded-[8px] bg-white/95 border border-black/5 flex items-center justify-center shrink-0 shadow-2xs">
                  <IconComp className={`w-4 h-4 ${conf.iconColor} stroke-[2.2]`} />
                </div>
                <div className="text-[11px] xl:text-[11.5px] font-bold text-[#1E1B3A] leading-[1.25] min-w-0">
                  {prob.title}
                </div>
              </div>

              <ChevronRight className={`w-4 h-4 shrink-0 ml-1 stroke-[2.4] ${conf.chevronColor}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

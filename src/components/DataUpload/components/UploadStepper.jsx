import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, UploadCloud, ShieldCheck, BarChart3, ChevronRight } from "lucide-react";

/**
 * Reusable three-stage progress indicator for Data Upload workflow.
 * Consistent across:
 * - Stage 1: /upload (UploadPage)
 * - Stage 2: /upload/validate/:sessionId (ValidationPage)
 * - Stage 3: /upload/results/:sessionId (InvestigationResultPage)
 */
export default function UploadStepper({
  currentStage = 1,
  sessionId = null,
  isValidated = false,
  onNavigate = null,
  className = "",
}) {
  const navigate = useNavigate();

  const isStage2Accessible = currentStage >= 2 && Boolean(sessionId);
  const isStage3Accessible =
    Boolean(sessionId) && (currentStage === 3 || (currentStage === 2 && isValidated));

  const handleStepClick = (targetStage) => {
    // If clicking current stage, do nothing
    if (targetStage === currentStage) return;

    // Navigating back to Stage 1 (Upload) is always permitted
    if (targetStage === 1) {
      if (onNavigate) {
        onNavigate("upload");
      } else {
        navigate("/upload");
      }
      return;
    }

    // Stage 2 requires being in Stage 2 or Stage 3 with an active session ID
    if (targetStage === 2) {
      if (isStage2Accessible && sessionId) {
        const dest = `/upload/validate/${encodeURIComponent(sessionId)}`;
        if (onNavigate) {
          onNavigate(dest);
        } else {
          navigate(dest);
        }
      }
      return;
    }

    // Stage 3 requires completed validation or already being at Stage 3
    if (targetStage === 3) {
      if (isStage3Accessible && sessionId) {
        const dest = `/upload/results/${encodeURIComponent(sessionId)}`;
        if (onNavigate) {
          onNavigate(dest);
        } else {
          navigate(dest);
        }
      }
    }
  };

  const steps = [
    {
      num: 1,
      title: "Upload Datasets",
      subtitle: "7 Manufacturing CSVs",
      icon: UploadCloud,
      isAccessible: true,
    },
    {
      num: 2,
      title: "Validate & Process",
      subtitle: "Schema & Quality Checks",
      icon: ShieldCheck,
      isAccessible: isStage2Accessible,
    },
    {
      num: 3,
      title: "Investigation Results",
      subtitle: "Deterministic Cost Analysis",
      icon: BarChart3,
      isAccessible: isStage3Accessible,
    },
  ];

  return (
    <div
      className={`w-full bg-white rounded-2xl p-2.5 sm:p-3 border border-purple-100 shadow-[0_2px_12px_rgba(111,61,186,0.04)] select-none ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {steps.map((step, idx) => {
          const isCurrent = currentStage === step.num;
          const isCompleted = currentStage > step.num;
          const isUpcoming = currentStage < step.num;
          const isClickable = step.isAccessible && !isCurrent;
          const StepIcon = step.icon;

          return (
            <div
              key={step.num}
              onClick={() => isClickable && handleStepClick(step.num)}
              className={`flex items-center gap-3 p-2 sm:p-2.5 rounded-xl border transition-all ${
                isCurrent
                  ? "bg-purple-50/80 border-purple-300 shadow-2xs"
                  : isCompleted
                  ? "bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50 cursor-pointer"
                  : isClickable
                  ? "bg-slate-50 border-slate-200 hover:bg-white cursor-pointer"
                  : "bg-slate-50/50 border-slate-100 opacity-40 cursor-not-allowed pointer-events-none select-none"
              }`}
              title={
                !step.isAccessible
                  ? "Complete previous stages to unlock"
                  : isClickable
                  ? `Navigate to ${step.title}`
                  : `Current stage: ${step.title}`
              }
            >
              {/* Step Badge */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                  isCompleted
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : isCurrent
                    ? "bg-[#7c3aed] text-white shadow-2xs"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>0{step.num}</span>
                )}
              </div>

              {/* Step Text Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-black truncate tracking-tight ${
                      isCurrent
                        ? "text-purple-950 font-black"
                        : isCompleted
                        ? "text-emerald-950 font-bold"
                        : "text-slate-500 font-semibold"
                    }`}
                  >
                    {step.title}
                  </span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  {step.subtitle}
                </p>
              </div>

              {/* Chevron icon (except last step) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex items-center text-slate-300 pl-1 shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

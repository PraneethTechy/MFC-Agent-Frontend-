import React from "react";

export default function VarianceWaterfall({ steps = [], currency = "₹" }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
        No variance steps available
      </div>
    );
  }

  const formatVal = (val) => {
    const num = Math.abs(val);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e7) return `${(num / 1e7).toFixed(2)}Cr`;
    if (num >= 1e5) return `${(num / 1e5).toFixed(1)}L`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Find min and max values to establish coordinate system
  const totals = steps.map((s) => s.running_total);
  const minVal = Math.min(...totals, steps[0].amount) * 0.96;
  const maxVal = Math.max(...totals, steps[steps.length - 1].amount) * 1.04;
  const valRange = maxVal - minVal || 1;

  // Chart dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingBottom = 40;
  const paddingTop = 30;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const colWidth = (svgWidth - 40) / steps.length;
  const barWidth = Math.min(colWidth * 0.72, 48);

  const getY = (val) => {
    const norm = (val - minVal) / valRange;
    return paddingTop + chartHeight * (1 - norm);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px]"
        >
          {/* Subtle grid lines */}
          <line
            x1="20"
            y1={getY(minVal + valRange * 0.25)}
            x2={svgWidth - 20}
            y2={getY(minVal + valRange * 0.25)}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />
          <line
            x1="20"
            y1={getY(minVal + valRange * 0.5)}
            x2={svgWidth - 20}
            y2={getY(minVal + valRange * 0.5)}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />
          <line
            x1="20"
            y1={getY(minVal + valRange * 0.75)}
            x2={svgWidth - 20}
            y2={getY(minVal + valRange * 0.75)}
            stroke="#f1f5f9"
            strokeDasharray="3 3"
          />

          {/* Waterfall Bars */}
          {steps.map((step, idx) => {
            const isStartOrEnd = step.step_type === "START" || step.step_type === "END";
            const isIncrease = step.amount >= 0 && !isStartOrEnd;
            const isDecrease = step.amount < 0 && !isStartOrEnd;

            let topY, bottomY;
            if (isStartOrEnd) {
              topY = getY(step.amount);
              bottomY = getY(minVal);
            } else if (isIncrease) {
              topY = getY(step.running_total);
              bottomY = getY(step.running_total - step.amount);
            } else {
              topY = getY(step.running_total - step.amount);
              bottomY = getY(step.running_total);
            }

            const h = Math.max(bottomY - topY, 4);
            const x = 30 + idx * colWidth + (colWidth - barWidth) / 2;

            let barFill = "#6366f1"; // purple
            if (isStartOrEnd) {
              barFill = "#4f46e5"; // deep purple for period total
            } else if (isIncrease) {
              barFill = "#f43f5e"; // rose/red for cost adds
            } else if (isDecrease) {
              barFill = "#10b981"; // green for cost saves
            }

            return (
              <g key={idx}>
                {/* Connector dotted line to next bar */}
                {idx < steps.length - 1 && (
                  <line
                    x1={x + barWidth}
                    y1={getY(step.running_total)}
                    x2={30 + (idx + 1) * colWidth + (colWidth - barWidth) / 2}
                    y2={getY(step.running_total)}
                    stroke="#cbd5e1"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                )}

                {/* Amount label above bar */}
                <text
                  x={x + barWidth / 2}
                  y={topY - 6}
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-slate-700"
                >
                  {isStartOrEnd ? "" : (step.amount >= 0 ? "+" : "-")}
                  {currency}
                  {formatVal(step.amount)}
                </text>

                {/* Bar rect */}
                <rect
                  x={x}
                  y={topY}
                  width={barWidth}
                  height={h}
                  rx="4"
                  fill={barFill}
                  className="transition-all hover:opacity-80 cursor-pointer"
                >
                  <title>
                    {`${step.name}: ${step.amount >= 0 ? "+" : ""}${currency}${formatVal(step.amount)} (${step.pct_change}%)`}
                  </title>
                </rect>

                {/* Category label below bar */}
                <text
                  x={x + barWidth / 2}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className="text-[8.5px] font-semibold fill-slate-500"
                >
                  {step.name.length > 14 ? step.name.slice(0, 12) + ".." : step.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-purple-50 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#4f46e5]" />
          <span>Period Total</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#f43f5e]" />
          <span>Cost Increase (adds)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />
          <span>Cost Decrease (saves)</span>
        </div>
      </div>
    </div>
  );
}

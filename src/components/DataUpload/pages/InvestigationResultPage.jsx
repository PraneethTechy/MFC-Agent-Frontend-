import React from "react";
import { useParams, useNavigate, useSearchParams, Navigate } from "react-router-dom";
import DataImportStudio from "../../DataImportStudio";

/**
 * Stage 3: Investigation Results Page (/upload/results/:sessionId)
 * Displays the comprehensive deterministic cost analysis, KPI cards,
 * trend spline chart, cost variance donut, SKU comparison, and AI recommendations
 * for the exact session ID resolved from the URL.
 */
export default function InvestigationResultPage({
  apiBaseUrl = "/api",
  onNavigate,
  onOpenAIChat,
  onImportSuccess,
}) {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeParams = Object.fromEntries(searchParams.entries());

  if (!sessionId || sessionId === "undefined" || sessionId === "null") {
    return (
      <Navigate
        to="/upload?msg=Please+upload+and+validate+your+datasets+before+viewing+results."
        replace
      />
    );
  }

  return (
    <DataImportStudio
      apiBaseUrl={apiBaseUrl}
      onNavigate={onNavigate}
      onOpenAIChat={onOpenAIChat}
      onImportSuccess={onImportSuccess}
      routeParams={routeParams}
      forcedStage={3}
      routeSessionId={sessionId}
      onNavigateToValidate={(sid) => {
        navigate(`/upload/validate/${encodeURIComponent(sid)}`);
      }}
      onNavigateToResults={(sid) => {
        navigate(`/upload/results/${encodeURIComponent(sid)}`);
      }}
      onNavigateToUpload={(msg) => {
        navigate(msg ? `/upload?msg=${encodeURIComponent(msg)}` : "/upload");
      }}
    />
  );
}

import React from "react";
import { useParams, useNavigate, useSearchParams, Navigate } from "react-router-dom";
import DataImportStudio from "../../DataImportStudio";

/**
 * Stage 2: Validation & Processing Page (/upload/validate/:sessionId)
 * Restores or displays validation operations, schema mapping checks,
 * record counts, and data quality metrics for the given session ID.
 * On completion, navigates to /upload/results/:sessionId.
 */
export default function ValidationPage({
  apiBaseUrl = "/api",
  onNavigate,
  onImportSuccess,
  onUploadStateChange,
}) {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeParams = Object.fromEntries(searchParams.entries());

  if (!sessionId || sessionId === "undefined" || sessionId === "null") {
    return (
      <Navigate
        to="/upload?msg=Please+upload+your+datasets+before+proceeding+to+validation."
        replace
      />
    );
  }

  return (
    <DataImportStudio
      apiBaseUrl={apiBaseUrl}
      onNavigate={onNavigate}
      onImportSuccess={onImportSuccess}
      onUploadStateChange={onUploadStateChange}
      routeParams={routeParams}
      forcedStage={2}
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

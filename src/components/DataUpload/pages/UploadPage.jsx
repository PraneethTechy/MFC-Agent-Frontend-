import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DataImportStudio from "../../DataImportStudio";
import { API_BASE_URL } from "../../../config/api";

/**
 * Stage 1: Dataset Upload Page (/upload)
 * Manages dataset drag-and-drop, 7-file requirement checking,
 * template downloads, and initiates validation streaming.
 * On upload start/completion, navigates to /upload/validate/:sessionId.
 */
export default function UploadPage({
  apiBaseUrl = API_BASE_URL,
  onNavigate,
  onImportSuccess,
  onUploadStateChange,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeParams = Object.fromEntries(searchParams.entries());

  return (
    <DataImportStudio
      apiBaseUrl={apiBaseUrl}
      onNavigate={onNavigate}
      onImportSuccess={onImportSuccess}
      onUploadStateChange={onUploadStateChange}
      routeParams={routeParams}
      forcedStage={1}
      onNavigateToValidate={(sessionId) => {
        navigate(`/upload/validate/${encodeURIComponent(sessionId)}`);
      }}
      onNavigateToResults={(sessionId) => {
        navigate(`/upload/results/${encodeURIComponent(sessionId)}`);
      }}
      onNavigateToUpload={() => {
        navigate("/upload");
      }}
    />
  );
}

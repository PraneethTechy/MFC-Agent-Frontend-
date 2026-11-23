/**
 * Centralized API Configuration Module
 * 
 * Single source of truth for backend API connectivity across the application.
 * Reads environment variables from Vite (import.meta.env.VITE_API_BASE_URL).
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const isProd = import.meta.env.PROD;

// Validate configuration
export const isPlaceholderUrl = (url) => {
  if (!url) return true;
  return (
    url.includes("YOUR-DEPLOYED-BACKEND-URL") ||
    url.includes("your-deployed-backend") ||
    url.includes("example.com")
  );
};

export const isApiConfigured = Boolean(
  rawBaseUrl && !isPlaceholderUrl(rawBaseUrl)
);

// Determine the resolved base URL
let resolvedBaseUrl = "";

if (isProd) {
  if (!rawBaseUrl || isPlaceholderUrl(rawBaseUrl)) {
    console.error(
      "[Production API Config Error] VITE_API_BASE_URL is not set or contains a placeholder value ('" +
        rawBaseUrl +
        "'). Please configure VITE_API_BASE_URL in your production deployment environment variables."
    );
    // In production without env var, fall back to relative path '/api' so reverse proxies (like Vercel rewrites) can route to backend
    resolvedBaseUrl = rawBaseUrl && !isPlaceholderUrl(rawBaseUrl) ? rawBaseUrl : "/api";
  } else {
    resolvedBaseUrl = rawBaseUrl;
  }
} else {
  // Development mode: default to local FastAPI server on port 8000
  resolvedBaseUrl = rawBaseUrl || "http://localhost:8000";
}

// Strip any trailing slashes for predictable endpoint concatenation
export const API_BASE_URL = resolvedBaseUrl.replace(/\/+$/, "");

/**
 * Resolves an API endpoint path against the centralized API_BASE_URL.
 * Preserves third-party / external absolute URLs without modification.
 * 
 * @param {string} endpoint - API path (e.g., "/api/reports/123" or "http://external.com/data")
 * @returns {string} - Fully qualified URL or absolute path
 */
export function getApiUrl(endpoint) {
  if (!endpoint) return API_BASE_URL;

  // External / absolute URLs are returned as-is
  if (
    endpoint.startsWith("http://") ||
    endpoint.startsWith("https://") ||
    endpoint.startsWith("//") ||
    endpoint.startsWith("data:") ||
    endpoint.startsWith("blob:")
  ) {
    return endpoint;
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

export default {
  API_BASE_URL,
  getApiUrl,
  isApiConfigured,
  isProduction: isProd,
};

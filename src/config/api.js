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
  // Development mode: use rawBaseUrl or default to "/api" (proxied to backend in vite.config.js)
  resolvedBaseUrl = rawBaseUrl || "/api";
}

// Strip trailing slashes
let cleanBase = resolvedBaseUrl.trim().replace(/\/+$/, "");

// Normalize to ensure base includes /api unless empty (supports both https://domain.com and https://domain.com/api)
if (cleanBase && !cleanBase.endsWith("/api")) {
  cleanBase += "/api";
}

export const API_BASE_URL = cleanBase;

/**
 * Resolves an API endpoint path against the centralized API_BASE_URL.
 * Preserves third-party / external absolute URLs without modification.
 * Automatically prevents duplicate "/api/api" if both base and endpoint specify "/api".
 * 
 * @param {string} endpoint - API path (e.g., "/reports/123", "/api/reports/123", or "http://external.com/data")
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

  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Prevent duplicate "/api/api" if base ends with /api and endpoint starts with /api/
  if (API_BASE_URL.endsWith("/api") && cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = cleanEndpoint.slice(4);
  }

  return `${API_BASE_URL}${cleanEndpoint}`;
}

export default {
  API_BASE_URL,
  getApiUrl,
  isApiConfigured,
  isProduction: isProd,
};

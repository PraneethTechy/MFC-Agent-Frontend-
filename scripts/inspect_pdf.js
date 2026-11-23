import fs from "fs";
import zlib from "zlib";

const pdfBuf = fs.readFileSync("C:/Users/gwc/Downloads/Manufacturing_RCA_Report_Verified_Sample.pdf");
const pdfStr = pdfBuf.toString("binary");

console.log("PDF File size:", pdfBuf.length, "bytes");

// Find all FlateDecode streams and decompress them
const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
let match;
let streamIndex = 0;
let totalDecompressedText = "";

while ((match = streamRegex.exec(pdfStr)) !== null) {
  streamIndex++;
  const rawStream = Buffer.from(match[1], "binary");
  try {
    const decompressed = zlib.inflateSync(rawStream);
    const decText = decompressed.toString("latin1");
    totalDecompressedText += `\n--- STREAM ${streamIndex} ---\n` + decText;
  } catch (e) {
    // Some streams might not be Flate encoded or might be images
  }
}

console.log("Found", streamIndex, "streams.");
console.log("Decompressed stream text length:", totalDecompressedText.length);

const checks = [
  "GWC DATA.AI",
  "MANUFACTURING INTELLIGENCE",
  "ROOT CAUSE ANALYSIS (RCA) DECISION REPORT",
  "1. INVESTIGATION SCOPE & PROVENANCE METADATA",
  "2. MANAGEMENT EXECUTIVE SUMMARY",
  "3. KEY PERFORMANCE INDICATORS SCORECARD",
  "4. MANUFACTURING COST TREND (ACTUAL VS. BASELINE)",
  "5. COST COMPOSITION VARIANCE & SKU BENCHMARK",
  "MATHEMATICAL VARIANCE RECONCILIATION",
  "PRODUCT SKU COST PERFORMANCE BENCHMARK",
  "6. ROOT CAUSE EVIDENCE & OPERATIONAL FINDINGS",
  "7. PRIORITIZED CORRECTIVE ACTION PLAN",
  "8. DATA COVERAGE & FACT STORE PROVENANCE",
  "Rs. 2.57 Cr",
  "Supplier SUP-104 Display Panel Lot Defect Fallout",
  "Page 1 of 3",
  "Page 2 of 3",
  "Page 3 of 3"
];

console.log("\n=== CONTENT VERIFICATION IN GENERATED PDF ===");
checks.forEach(check => {
  const found = totalDecompressedText.includes(check);
  console.log(`[${found ? "PASS" : "FAIL"}] ${check}`);
});

// Check for forbidden broken characters
const forbidden = ["\uFFFD", "₹", "?8.28", "?15.04", "?2.57"];
console.log("\n=== BROKEN CHARACTER CHECKS ===");
forbidden.forEach(f => {
  const present = totalDecompressedText.includes(f);
  console.log(`[${!present ? "PASS" : "FAIL"}] Does not contain '${f}': ${!present}`);
});

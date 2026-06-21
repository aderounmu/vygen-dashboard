import Papa from "papaparse";
import type { GetBusinessReportResponse } from "./services/business/types";

export function downloadBusinessReportCsv(
  report: GetBusinessReportResponse,
  startDate: string,
  endDate: string,
) {
  const summaryRows = [
    { section: "summary", name: "total_prompts", count: report.total_prompts },
    ...report.ai_tools.map((t) => ({
      section: "ai_tools",
      name: t.name,
      count: t.count,
    })),
    ...report.actions.map((a) => ({
      section: "actions",
      name: a.name,
      count: a.count,
    })),
    ...report.reasons.map((r) => ({
      section: "reasons",
      name: r.name,
      count: r.count,
    })),
  ];

  const eventRows = report.events.map((e) => ({
    id: e.id,
    business_id: e.business_id,
    business_member_id: e.business_member_id,
    ai_tool: e.ai_tool_data?.tool_name ?? e.ai_tool,
    encrypted_content: e.encrypted_content,
    risk_score: e.risk_score,
    action: e.action,
    reasons: e.reasons,
    created_at: e.created_at,
  }));

  const csv = [
    "# Summary",
    Papa.unparse(summaryRows),
    "",
    "# Events",
    Papa.unparse(eventRows),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `business-report_${startDate}_to_${endDate}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateSecurePassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  // Create a 32-bit array to store secure random values
  const randomValues = new Uint32Array(length);
  // Populate the array with cryptographically secure random values
  window.crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  return password;
}
console.log(generateSecurePassword(16)); 
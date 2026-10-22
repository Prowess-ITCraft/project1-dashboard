import type { PreviewRole } from "../mock/types";

export const roleByName: Record<string, string> = {
  "Sattish Agadii": "Director",
  "Aditya Kumar": "Admin",
  "Charmi Shah": "Project manager",
  "Sheshadri Chintakindi": "Technical lead (verifier)",
  "Akash Agadii": "Sales and BD",
  "Ashwini Sawant": "Solution architect",
  "Shruti Satam": "Audit engineer",
  "Yash Raikar": "Field engineer",
  "Sakshi Rajbhar": "Field engineer",
  "Bhakti Pawar": "Field engineer",
  "Ajit Dubey": "Field engineer",
  "Neeta Darge": "Field engineer",
};

export const previewRoles: { id: PreviewRole; label: string }[] = [
  { id: "director", label: "Director" },
  { id: "pm", label: "Project manager" },
  { id: "verifier", label: "Verifier" },
];

export const fieldPresence = {
  offline: "Bhakti Pawar",
  failed: "Ajit Dubey",
  notInField: "Neeta Darge",
};

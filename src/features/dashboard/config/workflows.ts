import type { StageId, WorkflowId } from "../mock/types";

export type StageDef = {
  id: StageId;
  label: string;
  eightLabel: string;
  eightIndex: number;
};

export const stages: StageDef[] = [
  { id: "intake", label: "Intake", eightLabel: "Audit intake", eightIndex: 1 },
  { id: "kickoff", label: "Kick-off", eightLabel: "Current IT", eightIndex: 2 },
  { id: "planning", label: "Planning", eightLabel: "Plan", eightIndex: 6 },
  { id: "execution", label: "Execution", eightLabel: "Field work", eightIndex: 7 },
  { id: "closure", label: "Closure", eightLabel: "Certified", eightIndex: 8 },
];

export const workflows: Record<WorkflowId, { id: WorkflowId; stages: { id: string; label: string }[] }> = {
  "five-cores": {
    id: "five-cores",
    stages: stages.map((stage) => ({ id: stage.id, label: stage.label })),
  },
  "eight-stages": {
    id: "eight-stages",
    stages: [
      { id: "audit-intake", label: "Audit intake" },
      { id: "current-it", label: "Current IT" },
      { id: "ideal-it", label: "Ideal IT" },
      { id: "gap-analysis", label: "Gap analysis" },
      { id: "quotation", label: "Quotation" },
      { id: "plan", label: "Plan" },
      { id: "field-work", label: "Field work" },
      { id: "certified", label: "Certified" },
    ],
  },
};

export function stageLine(stage: StageId, workflow: WorkflowId) {
  const match = stages.find((item) => item.id === stage);
  if (!match) return "";
  if (workflow === "eight-stages") return `${match.eightLabel}, stage ${match.eightIndex} of 8`;
  const index = stages.findIndex((item) => item.id === stage) + 1;
  return `${match.label}, stage ${index} of 5`;
}

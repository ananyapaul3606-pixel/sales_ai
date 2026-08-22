const API_BASE = "http://127.0.0.1:8000";

const SCORE_COLORS = {
  HOT: "text-red-600 bg-red-50",
  WARM: "text-amber-600 bg-amber-50",
  COLD: "text-gray-600 bg-gray-50",
};

const STATUS_OPTIONS = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
];

const SCORE_LABELS = ["HOT", "WARM", "COLD"];

export { API_BASE, SCORE_COLORS, STATUS_OPTIONS, SCORE_LABELS };

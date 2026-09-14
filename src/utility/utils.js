export const DEFAULT_BASE_URL = "https://todo-app-backend-spring-boot.onrender.com";
// export const DEFAULT_BASE_URL = "http://localhost:8080";
export const TOKEN_STORAGE_KEY = "todo-app.tokens";
export const PRIORITIES = ["HIGH", "MEDIUM", "LOW"];
export const STATUSES = ["TODO", "DELAYED", "PENDING", "COMPLETE", "CANCELLED"];

export function toIsoOrNull(value) {
  return value ? new Date(value).toISOString() : null;
}

export function formatDateTime(value) {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function sortTasksByDisplayOrder(items) {
  return [...items].sort((a, b) => {
    const first = Number(a.displayOrder ?? 0);
    const second = Number(b.displayOrder ?? 0);
    return second - first;
  });
}

export function loadStoredTokens() {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function getTaskId(task) {
  return task.id ?? task.taskId ?? task._id ?? task.uuid;
}

export function taskUpdatePayload(task, displayOrder) {
  return {
    title: task.title ?? "",
    description: task.description ?? "",
    status: task.status || null,
    priority: task.priority || null,
    dueDate: task.dueDate ?? null,
    displayOrder,
    completedAt: task.completedAt ?? null,
  };
}

export function priorityTone(priority) {
  if (priority === "HIGH") return "high";
  if (priority === "MEDIUM") return "medium";
  if (priority === "LOW") return "low";
  return "neutral";
}

export function statusTone(status) {
  if (status === "COMPLETE") return "low";
  if (status === "DELAYED") return "high";
  if (status === "PENDING") return "medium";
  if (status === "CANCELLED") return "cancelled";
  return "neutral";
}

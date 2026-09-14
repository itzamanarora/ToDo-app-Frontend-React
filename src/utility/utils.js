export const DEFAULT_BASE_URL = "https://todo-app-backend-spring-boot.onrender.com";
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

export function toCamelCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function taskUpdatePayload(task, displayOrder) {
  const isComplete = task.status === "COMPLETE";
  return {
    title: task.title ?? "",
    description: task.description ?? "",
    status: task.status || null,
    priority: task.priority || null,
    dueDate: task.dueDate ?? null,
    displayOrder: displayOrder ?? task.displayOrder ?? 0,
    completedAt: isComplete ? (task.completedAt ?? new Date().toISOString()) : null,
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

export function validateAuth({ email, password }) {
  if (!email || !email.trim()) {
    return "Email is required.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Please enter a valid email address.";
  }

  if (!password) {
    return "Password is required.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (password.length > 128) {
    return "Password must not exceed 128 characters.";
  }

  return null;
}


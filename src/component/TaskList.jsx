import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  Flag,
  GripVertical,
  Plus,
} from "lucide-react";
import { Field } from "./Field";
import { TaskChip } from "./TaskChip";
import {
  PRIORITIES,
  STATUSES,
  formatDateTime,
  getTaskId,
  priorityTone,
  sortTasksByDisplayOrder,
  statusTone,
} from "../utility/utils";

export function TaskList({
  tasks,
  loading,
  onRefresh,
  showComposer,
  setShowComposer,
  newTitle,
  setNewTitle,
  newDesc,
  setNewDesc,
  newPriority,
  setNewPriority,
  newStatus,
  setNewStatus,
  newDueDate,
  setNewDueDate,
  newCompletedAt,
  setNewCompletedAt,
  onCreate,
  onReorder,
}) {
  const orderedTasks = sortTasksByDisplayOrder(tasks);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#94A3B8]">
          {tasks.length} {tasks.length === 1 ? "item" : "items"}
        </p>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-[13px] text-[#64748B] hover:text-[#2563EB] transition-colors"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {tasks.length === 0 && !loading && (
        <div className="rounded-md border border-dashed border-[#E5E7EB] px-4 py-8 text-center text-sm text-[#94A3B8]">
          Nothing on the list yet. Add your first task below.
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {orderedTasks.map((t, i) => (
          <li
            key={t.id ?? t._id ?? i}
            draggable={!!getTaskId(t)}
            onDragStart={() => setDraggedTaskId(getTaskId(t))}
            onDragEnd={() => setDraggedTaskId(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onReorder(draggedTaskId, getTaskId(t));
              setDraggedTaskId(null);
            }}
            className={`rounded-md border bg-[#FFFFFF] px-3 py-3 transition-colors ${
              draggedTaskId === getTaskId(t)
                ? "border-[#2563EB] opacity-70"
                : "border-[#E5E7EB]"
            }`}
          >
            <div className="flex items-start gap-3">
              <GripVertical
                size={16}
                className="mt-0.5 shrink-0 cursor-grab text-[#94A3B8]"
              />
              {t.status === "COMPLETE" || t.completed ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#16A34A]" />
              ) : (
                <Circle size={18} className="mt-0.5 shrink-0 text-[#94A3B8]" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-[#111827] truncate">
                    {t.title ?? "Untitled task"}
                  </p>
                </div>
                {t.description && (
                  <p className="text-[13px] text-[#64748B] mt-0.5 line-clamp-2">
                    {t.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <TaskChip icon={<Flag size={12} />} tone={priorityTone(t.priority)}>
                    {t.priority || "No priority"}
                  </TaskChip>
                  <TaskChip tone={statusTone(t.status)}>
                    {t.status || "No status"}
                  </TaskChip>
                  <TaskChip icon={<CalendarClock size={12} />}>
                    {formatDateTime(t.dueDate)}
                  </TaskChip>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showComposer ? (
        <form
          onSubmit={onCreate}
          className="mt-2 flex flex-col gap-2 rounded-md border border-[#E5E7EB] bg-[#FFFFFF] p-3"
        >
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
            required
            className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Notes (optional)"
            rows={2}
            className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2563EB] resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Priority">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="input"
              >
                <option value="">No priority</option>
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input"
              >
                <option value="">No status</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Due date">
            <input
              type="datetime-local"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Completed at">
            <input
              type="datetime-local"
              value={newCompletedAt}
              onChange={(e) => setNewCompletedAt(e.target.value)}
              className="input"
            />
          </Field>
          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              className="flex-1 rounded-md bg-[#2563EB] px-3 py-2 text-sm font-medium text-[#FFFFFF] hover:bg-[#3B82F6] transition-colors"
            >
              Add task
            </button>
            <button
              type="button"
              onClick={() => setShowComposer(false)}
              className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#64748B] hover:text-[#111827] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowComposer(true)}
          className="mt-2 flex items-center justify-center gap-2 rounded-md border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#2563EB] hover:border-[#2563EB]/60 transition-colors"
        >
          <Plus size={16} />
          Add a task
        </button>
      )}
      <style>{`
        .input {
          margin-top: 4px;
          width: 100%;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          background: #F8FAFC;
          padding: 10px 12px;
          font-size: 14px;
          color: #111827;
        }
        .input:focus {
          outline: none;
          box-shadow: 0 0 0 1px #2563EB;
          border-color: #2563EB;
        }
      `}</style>
    </div>
  );
}

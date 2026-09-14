import { useState, useEffect } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Flag,
  GripVertical,
  Plus,
  Save,
  Trash,
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
  toCamelCase,
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
  onUpdateTask,
  onDeleteTask,
}) {
  const orderedTasks = sortTasksByDisplayOrder(tasks);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const toggleExpand = (taskId) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

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
        {orderedTasks.map((t, i) => {
          const taskId = getTaskId(t);
          const isExpanded = expandedTaskId === taskId;

          return (
            <TaskItem
              key={taskId ?? i}
              task={t}
              taskId={taskId}
              isExpanded={isExpanded}
              onToggleExpand={() => toggleExpand(taskId)}
              draggedTaskId={draggedTaskId}
              setDraggedTaskId={setDraggedTaskId}
              onReorder={onReorder}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          );
        })}
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
                    {toCamelCase(status)}
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
          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-[#2563EB] px-3 py-2 text-sm font-medium text-[#FFFFFF] hover:bg-[#3B82F6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving…" : "Save task"}
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

function TaskItem({
  task,
  taskId,
  isExpanded,
  onToggleExpand,
  draggedTaskId,
  setDraggedTaskId,
  onReorder,
  onUpdateTask,
  onDeleteTask,
}) {
  const [editTitle, setEditTitle] = useState(task.title ?? "");
  const [editDesc, setEditDesc] = useState(task.description ?? "");
  const [editPriority, setEditPriority] = useState(task.priority ?? "");
  const [editStatus, setEditStatus] = useState(task.status ?? "");
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
  );
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setEditTitle(task.title ?? "");
    setEditDesc(task.description ?? "");
    setEditPriority(task.priority ?? "");
    setEditStatus(task.status ?? "");
    setEditDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
    );
  }, [task]);

  const handleFieldChangeAndSave = (updatedFields) => {
    const updated = {
      ...task,
      ...updatedFields,
    };
    onUpdateTask(taskId, updated);
  };

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    const newStatus = task.status === "COMPLETE" ? "TODO" : "COMPLETE";
    handleFieldChangeAndSave({ status: newStatus });
  };

  const handleDeleteDialogBox = (e) => {
    e.stopPropagation();
    setOpenDialog(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    setOpenDialog(false);
    if (onDeleteTask) {
      onDeleteTask(taskId);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setOpenDialog(false);
  };

  return (
    <li
      draggable={!isExpanded && !!taskId}
      onDragStart={() => setDraggedTaskId(taskId)}
      onDragEnd={() => setDraggedTaskId(null)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onReorder(draggedTaskId, taskId);
        setDraggedTaskId(null);
      }}
      className={`rounded-md border bg-[#FFFFFF] px-3 py-3 transition-colors ${
        draggedTaskId === taskId ? "border-[#2563EB] opacity-70" : "border-[#E5E7EB]"
      }`}
    >
      {/* Delete Confirmation Dialog */}
      {openDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-semibold text-gray-900">
              Delete Task
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              Are you sure you want to delete <strong className="text-gray-800">"{task.title || "this task"}"</strong>? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 cursor-pointer" onClick={onToggleExpand}>
        <GripVertical
          size={16}
          className="mt-0.5 shrink-0 cursor-grab text-[#94A3B8]"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type="button"
          onClick={handleToggleComplete}
          className="mt-0.5 shrink-0 focus:outline-none"
        >
          {task.status === "COMPLETE" || task.completed ? (
            <CheckCircle2 size={18} className="text-[#16A34A]" />
          ) : (
            <Circle size={18} className="text-[#94A3B8]" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm font-medium truncate ${
                task.status === "COMPLETE" ? "line-through text-[#94A3B8]" : "text-[#111827]"
              }`}
            >
              {task.title ?? "Untitled task"}
            </p>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleDeleteDialogBox}
                className="p-0.5 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors focus:outline-none"
                title="Delete task"
              >
                <Trash size={16} />
              </button>
              {isExpanded ? (
                <ChevronUp size={16} className="text-[#64748B]" />
              ) : (
                <ChevronDown size={16} className="text-[#64748B]" />
              )}
            </div>
          </div>

          {!isExpanded && task.description && (
            <p className="text-[13px] text-[#64748B] mt-0.5 line-clamp-2">
              {task.description}
            </p>
          )}

          {!isExpanded && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <TaskChip icon={<Flag size={12} />} tone={priorityTone(task.priority)}>
                {task.priority ? toCamelCase(task.priority) : "No priority"}
              </TaskChip>
              <TaskChip tone={statusTone(task.status)}>
                {task.status ? toCamelCase(task.status) : "No status"}
              </TaskChip>
              <TaskChip icon={<CalendarClock size={12} />}>
                {formatDateTime(task.dueDate)}
              </TaskChip>
              {(task.status === "COMPLETE" || task.completedAt) && (
                <TaskChip icon={<CheckCircle2 size={12} />} tone="low">
                  Completed: {formatDateTime(task.completedAt)}
                </TaskChip>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded details & view/editor */}
      {isExpanded && (
        <div
          className="mt-4 pt-3 border-t border-[#F1F5F9] flex flex-col gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {task.status === "COMPLETE" ? (
            <div className="rounded-md bg-[#F8FAFC] p-3 border border-[#E2E8F0] flex flex-col gap-2 text-xs text-[#475569]">
              <p className="font-medium text-[#16A34A] text-sm flex items-center gap-1">
                <CheckCircle2 size={16} /> Completed Task (View Only)
              </p>
              <div>
                <span className="font-semibold">Title:</span> {task.title ?? "Untitled task"}
              </div>
              {task.description && (
                <div>
                  <span className="font-semibold">Description:</span> {task.description}
                </div>
              )}
              <div>
                <span className="font-semibold">Priority:</span> {task.priority ? toCamelCase(task.priority) : "None"}
              </div>
              <div>
                <span className="font-semibold">Due Date:</span> {formatDateTime(task.dueDate)}
              </div>
              <div>
                <span className="font-semibold">Completed At:</span> {formatDateTime(task.completedAt)}
              </div>
            </div>
          ) : (
            <>
              <Field label="Title">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => {
                    if (editTitle !== task.title) {
                      handleFieldChangeAndSave({ title: editTitle });
                    }
                  }}
                  className="input"
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  onBlur={() => {
                    if (editDesc !== task.description) {
                      handleFieldChangeAndSave({ description: editDesc });
                    }
                  }}
                  rows={2}
                  className="input resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Priority">
                  <select
                    value={editPriority}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditPriority(val);
                      handleFieldChangeAndSave({ priority: val || null });
                    }}
                    className="input"
                  >
                    <option value="">No priority</option>
                    {PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {toCamelCase(priority)}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Status">
                  <select
                    value={editStatus}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditStatus(val);
                      handleFieldChangeAndSave({ status: val || null });
                    }}
                    className="input"
                  >
                    <option value="">No status</option>
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {toCamelCase(status)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Due date">
                <input
                  type="datetime-local"
                  value={editDueDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditDueDate(val);
                    handleFieldChangeAndSave({
                      dueDate: val ? new Date(val).toISOString() : null,
                    });
                  }}
                  className="input"
                />
              </Field>
            </>
          )}
        </div>
      )}
    </li>
  );
}

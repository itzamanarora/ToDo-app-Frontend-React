import { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { Header } from "../component/Header";
import { AuthForm } from "../component/AuthForm";
import { TaskList } from "../component/TaskList";
import { Toast } from "../component/Toast";
import {
  DEFAULT_BASE_URL,
  TOKEN_STORAGE_KEY,
  getTaskId,
  loadStoredTokens,
  sortTasksByDisplayOrder,
  taskUpdatePayload,
  toIsoOrNull,
  validateAuth,
} from "../utility/utils";

export default function TodoPage() {
  const [baseUrl] = useState(DEFAULT_BASE_URL);
  const [tokens, setTokens] = useState(() => loadStoredTokens()); // { accessToken, refreshToken }
  
  // Read current path or default
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  const [screen, setScreen] = useState(() => {
    const hasToken = !!loadStoredTokens()?.accessToken;
    if (hasToken) return "tasks";
    if (typeof window !== "undefined" && window.location.pathname === "/signup") {
      return "signup";
    }
    return "signin";
  }); // signin | signup | tasks

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // auth form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // tasks
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [showComposer, setShowComposer] = useState(false);

  // Router sync
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (tokens?.accessToken) {
        setScreen("tasks");
      } else if (path === "/signup") {
        setScreen("signup");
      } else {
        setScreen("signin");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [tokens]);

  const navigateTo = (newScreen, path) => {
    setScreen(newScreen);
    setCurrentPath(path);
    if (typeof window !== "undefined" && window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
  };

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    if (tokens?.accessToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
      if (window.location.pathname !== "/tasks") {
        window.history.pushState({}, "", "/tasks");
      }
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [tokens]);

  const clearAuthFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  async function callApi(path, options = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(tokens?.accessToken
          ? { Authorization: `Bearer ${tokens.accessToken}` }
          : {}),
        ...(options.headers || {}),
      },
    });
    let body = null;
    try {
      body = await res.json();
    } catch {
      // no body
    }
    if (!res.ok) {
      const errObj = new Error(
        body?.message || body?.error || `Request failed (${res.status})`
      );
      errObj.response = body;
      errObj.status = res.status;
      throw errObj;
    }
    return body;
  }

  function extractTokens(body) {
    const data = body?.data || body;
    const accessToken =
      data?.accessToken || data?.access_token || data?.token;
    const refreshToken = data?.refreshToken || data?.refresh_token;
    return { accessToken, refreshToken };
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    const validationError = validateAuth({ email, password });
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await callApi("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, email: email.trim(), password }),
      });
      clearAuthFields();
      navigateTo("signin", "/signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignin(e) {
    e.preventDefault();
    setError("");
    const validationError = validateAuth({ email, password });
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const body = await callApi("/api/v1/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const t = extractTokens(body);
      const data = body?.data || body;
      const returnedUsername = data?.username || data?.user?.username || "";
      if (!t.accessToken) throw new Error("No access token in response");
      setTokens({ ...t, username: returnedUsername });
      clearAuthFields();
      navigateTo("tasks", "/tasks");
    } catch (err) {
      const msg = err?.response?.message || err?.message || "";
      if (msg.toLowerCase().includes("incorrect password")) {
        setToastMessage("Incorrect Password");
        setError("");
      } else if (
        msg.toLowerCase().includes("invalid email") ||
        msg.toLowerCase().includes("invalid email or password") ||
        err?.response?.status === 400
      ) {
        setToastMessage("Account does not exist. Please sign up first.");
        setError("");
        navigateTo("signup", "/signup");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  const fetchTasks = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const body = await callApi("/api/v1/task/get", { method: "GET" });
      const list = body?.data || body?.tasks || body || [];
      setTasks(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, baseUrl]);

  useEffect(() => {
    if (screen === "tasks" && tokens?.accessToken) {
      fetchTasks();
    }
  }, [screen, tokens, fetchTasks]);

  async function handleCreateTask(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError("");
    setLoading(true);
    try {
      await callApi("/api/v1/task/create", {
        method: "POST",
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim(),
          status: newStatus || null,
          priority: newPriority || null,
          dueDate: toIsoOrNull(newDueDate),
          displayOrder: tasks.length + 1,
          completedAt: null,
        }),
      });
      setNewTitle("");
      setNewDesc("");
      setNewPriority("");
      setNewStatus("");
      setNewDueDate("");
      setShowComposer(false);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateTask(taskId, updatedTask) {
    if (!taskId) return;
    
    // Optimistic UI update
    setTasks((prevTasks) =>
      prevTasks.map((t) => (getTaskId(t) === taskId ? { ...t, ...updatedTask } : t))
    );

    try {
      await callApi(`/api/v1/task/update/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(taskUpdatePayload(updatedTask)),
      });
      fetchTasks();
    } catch (err) {
      setError(err.message);
      fetchTasks();
    }
  }

  function handleLogout() {
    setTokens(null);
    setTasks([]);
    navigateTo("signin", "/signin");
  }

  async function handleReorderTask(activeId, overId) {
    if (!activeId || !overId || activeId === overId) return;

    const orderedTasks = sortTasksByDisplayOrder(tasks);
    const fromIndex = orderedTasks.findIndex(
      (task) => String(getTaskId(task)) === String(activeId)
    );
    const toIndex = orderedTasks.findIndex(
      (task) => String(getTaskId(task)) === String(overId)
    );
    if (fromIndex < 0 || toIndex < 0) return;

    const nextOrderedTasks = [...orderedTasks];
    const [movedTask] = nextOrderedTasks.splice(fromIndex, 1);
    nextOrderedTasks.splice(toIndex, 0, movedTask);

    const reorderedTasks = nextOrderedTasks.map((task, index) => ({
      ...task,
      displayOrder: nextOrderedTasks.length - index,
    }));
    const changedTasks = reorderedTasks.filter((task) => {
      const oldTask = orderedTasks.find(
        (item) => String(getTaskId(item)) === String(getTaskId(task))
      );
      return Number(task.displayOrder ?? 0) !== Number(oldTask?.displayOrder ?? 0);
    });

    setError("");
    setTasks(reorderedTasks);
    try {
      await Promise.all(
        changedTasks.map((task) => {
          const taskId = getTaskId(task);
          if (!taskId) throw new Error("Task id missing in API response");
          return callApi(`/api/v1/task/update/${taskId}`, {
            method: "PATCH",
            body: JSON.stringify(taskUpdatePayload(task, task.displayOrder)),
          });
        })
      );
      fetchTasks();
    } catch (err) {
      setTasks(tasks);
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F8FAFC] text-[#111827]">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      <div className="w-full max-w-md flex flex-col min-h-screen">
        <Header
          screen={screen}
          onLogout={handleLogout}
          loggedIn={!!tokens}
          username={tokens?.username}
        />

        {error && (
          <div className="mx-5 mt-3 flex items-start gap-2 rounded-md border border-[#DC2626]/40 bg-[#DC2626]/10 px-3 py-2 text-sm text-[#B91C1C]">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex-1 px-5 pb-8 pt-4">
          {screen === "signin" && (
            <AuthForm
              mode="signin"
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onSubmit={handleSignin}
              loading={loading}
              onSwitch={() => {
                setError("");
                clearAuthFields();
                navigateTo("signup", "/signup");
              }}
            />
          )}

          {screen === "signup" && (
            <AuthForm
              mode="signup"
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onSubmit={handleSignup}
              loading={loading}
              onSwitch={() => {
                setError("");
                clearAuthFields();
                navigateTo("signin", "/signin");
              }}
            />
          )}

          {screen === "tasks" && (
            <TaskList
              tasks={tasks}
              loading={loading}
              onRefresh={fetchTasks}
              showComposer={showComposer}
              setShowComposer={setShowComposer}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              newDesc={newDesc}
              setNewDesc={setNewDesc}
              newPriority={newPriority}
              setNewPriority={setNewPriority}
              newStatus={newStatus}
              setNewStatus={setNewStatus}
              newDueDate={newDueDate}
              setNewDueDate={setNewDueDate}
              onCreate={handleCreateTask}
              onReorder={handleReorderTask}
              onUpdateTask={handleUpdateTask}
            />
          )}
        </div>
      </div>
    </div>
  );
}

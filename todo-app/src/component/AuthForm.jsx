import { Loader2 } from "lucide-react";
import { Field } from "./Field";

export function AuthForm({
  mode,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  loading,
  onSwitch,
}) {
  const isSignup = mode === "signup";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
      {isSignup && (
        <Field label="Username">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input"
            placeholder="ananya_writes"
          />
        </Field>
      )}
      <Field label="Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Password">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="input"
          placeholder="••••••••"
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#2563EB] px-4 py-2.5 font-medium text-[#FFFFFF] hover:bg-[#3B82F6] transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {isSignup ? "Sign up" : "Sign in"}
      </button>

      <button
        type="button"
        onClick={onSwitch}
        className="text-sm text-[#64748B] hover:text-[#111827] transition-colors self-center mt-1"
      >
        {isSignup
          ? "Already have an account? Sign in"
          : "New here? Create an account"}
      </button>

      <style>{`
        .input {
          margin-top: 4px;
          width: 100%;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
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
    </form>
  );
}

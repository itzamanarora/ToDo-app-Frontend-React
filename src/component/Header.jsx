import { LogOut } from "lucide-react";

export function Header({ screen, onLogout, loggedIn, username }) {
  const titles = {
    signin: "Welcome back",
    signup: "Create account",
    tasks: "Your list",
  };
  return (
    <div className="px-5 pt-8 pb-2 flex items-center justify-between">
      <div>
        <p className="text-[11px] tracking-wide text-[#64748B]">
          field notes
        </p>
        <h1 className="text-2xl font-semibold text-[#2563EB] leading-tight">
          {titles[screen]}
        </h1>
        {screen === "tasks" && username && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[#475569]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#DBEAFE] font-semibold text-[#1D4ED8]">
              {username.charAt(0).toUpperCase()}
            </span>
            <span>
              Welcome, <strong className="font-semibold text-[#0F172A]">{username}</strong>
            </span>
          </div>
        )}
      </div>
      {loggedIn && (
        <button
          onClick={onLogout}
          className="flex items-center gap-1 rounded-md border border-[#E5E7EB] px-3 py-1.5 text-sm text-[#64748B] hover:text-[#111827] hover:border-[#CBD5E1] transition-colors"
        >
          <LogOut size={14} />
          Log out
        </button>
      )}
    </div>
  );
}

import { LogOut } from "lucide-react";

export function Header({ screen, onLogout, loggedIn }) {
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

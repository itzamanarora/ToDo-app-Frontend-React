export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[13px] text-[#64748B]">{label}</span>
      {children}
    </label>
  );
}

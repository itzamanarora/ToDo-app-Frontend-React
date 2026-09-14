export function TaskChip({ children, icon, tone = "neutral" }) {
  const tones = {
    neutral: "border-[#CBD5E1] bg-[#F8FAFC] text-[#475569]",
    high: "border-[#DC2626]/50 bg-[#DC2626]/10 text-[#B91C1C]",
    medium: "border-[#2563EB]/50 bg-[#2563EB]/10 text-[#3B82F6]",
    low: "border-[#16A34A]/50 bg-[#16A34A]/10 text-[#15803D]",
    cancelled: "border-[#94A3B8] bg-[#E5E7EB]/60 text-[#64748B]",
  };

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] leading-4 ${tones[tone]}`}
    >
      {icon}
      <span className="truncate">{children}</span>
    </span>
  );
}

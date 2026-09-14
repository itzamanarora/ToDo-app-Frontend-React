export function BaseUrlField({ baseUrl, setBaseUrl, disabled }) {
  return (
    <label className="block">
      <span className="text-[11px] text-[#94A3B8]">API base URL</span>
      <input
        value={baseUrl}
        disabled={disabled}
        onChange={(e) => setBaseUrl(e.target.value)}
        className="mt-1 w-full rounded-md border border-[#E5E7EB] bg-[#FFFFFF] px-3 py-2 text-sm text-[#334155] font-mono focus:outline-none focus:ring-1 focus:ring-[#2563EB] disabled:opacity-50"
        placeholder="http://localhost:8000"
      />
    </label>
  );
}

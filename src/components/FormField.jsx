export default function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  error,
  placeholder,
  autoComplete,
  helperText,
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : undefined}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none shadow-sm placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 ${error ? "border-red-400" : "border-slate-200"}`}
      />
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface AdminFormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: Array<{ value: string; label: string }>;
  hint?: string;
}

export default function AdminFormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  rows = 4,
  options,
  hint,
}: AdminFormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="admin-label">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className="admin-input resize-y"
        />
      ) : type === "select" && options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="admin-input"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="admin-input"
        />
      )}

      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

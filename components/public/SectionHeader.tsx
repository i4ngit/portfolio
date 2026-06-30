interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-widest uppercase text-navy mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-text">{title}</h2>
      {description && (
        <p className="mt-3 text-muted text-base max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
      <div
        className={`mt-4 h-0.5 w-12 bg-navy rounded-full ${
          centered ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}

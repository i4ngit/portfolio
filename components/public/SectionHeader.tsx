interface SectionHeaderProps {
  title: string;
  id?: string;
  description?: string;
}

export default function SectionHeader({ title, id, description }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <h2 id={id} className="section-label">{title}</h2>
      {description && (
        <p className="text-sm text-gray-500 leading-relaxed -mt-1">{description}</p>
      )}
    </div>
  );
}

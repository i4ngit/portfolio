import type { Milestone } from "@/lib/types";
import { CheckCircle2, Clock, Circle } from "lucide-react";

const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, label: "Completed", className: "text-green-600" },
  "in-progress": { icon: Clock, label: "In Progress", className: "text-amber-500" },
  upcoming: { icon: Circle, label: "Upcoming", className: "text-gray-300" },
};

interface MilestoneItemProps {
  milestone: Milestone;
}

export default function MilestoneItem({ milestone }: MilestoneItemProps) {
  const { icon: Icon, label, className } = STATUS_CONFIG[milestone.status];

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <Icon size={15} className={`flex-shrink-0 mt-0.5 ${className}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 leading-snug">{milestone.title}</p>
        {milestone.detail && (
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{milestone.detail}</p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="text-xs text-gray-400">{milestone.date}</span>
      </div>
    </div>
  );
}

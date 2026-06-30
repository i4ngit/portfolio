import type { Milestone } from "@/lib/types";
import { CheckCircle2, Clock, Circle } from "lucide-react";

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle2,
    iconClass: "text-green-accent",
    badgeClass: "badge-completed",
    label: "Completed",
  },
  "in-progress": {
    icon: Clock,
    iconClass: "text-amber-600",
    badgeClass: "badge-in-progress",
    label: "In Progress",
  },
  upcoming: {
    icon: Circle,
    iconClass: "text-muted",
    badgeClass: "badge-upcoming",
    label: "Upcoming",
  },
};

const CATEGORY_COLOR: Record<Milestone["category"], string> = {
  academic: "border-l-navy",
  application: "border-l-green-accent",
  recognition: "border-l-amber-600",
  research: "border-l-blue-400",
};

interface MilestoneItemProps {
  milestone: Milestone;
}

export default function MilestoneItem({ milestone }: MilestoneItemProps) {
  const { icon: Icon, iconClass, badgeClass, label } = STATUS_CONFIG[milestone.status];

  return (
    <div className={`card border-l-4 ${CATEGORY_COLOR[milestone.category]} flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-text text-sm leading-snug">{milestone.title}</h3>
        <Icon size={18} className={`flex-shrink-0 mt-0.5 ${iconClass}`} />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
        <span className="text-xs text-muted">{milestone.date}</span>
        <span className={badgeClass}>{label}</span>
      </div>

      {milestone.detail && (
        <p className="text-xs text-muted border-t border-border pt-2">{milestone.detail}</p>
      )}
    </div>
  );
}

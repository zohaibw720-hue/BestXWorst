
import { ArrowRight } from "lucide-react";

function EmptyState({
  title = "No articles found.",
  message = "Try another search or category.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="status-panel empty-state">
      <span className="empty-mark">BXW.</span>

      <h3>{title}</h3>
      <p>{message}</p>

      {actionLabel && typeof onAction === "function" && (
        <button
          className="text-link"
          type="button"
          onClick={onAction}
        >
          {actionLabel} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

export default EmptyState;

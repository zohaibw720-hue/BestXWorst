
import { ArrowRight } from "lucide-react";

function ErrorMessage({
  title = "Something went wrong.",
  message = "Please try again.",
  onRetry,
}) {
  return (
    <div className="status-panel status-error" role="alert">
      <h3>{title}</h3>
      <p>{message}</p>

      {typeof onRetry === "function" && (
        <button
          className="button-primary"
          type="button"
          onClick={onRetry}
        >
          TRY AGAIN <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;

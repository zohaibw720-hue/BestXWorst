
function LoadingState({ message = "Loading..." }) {
  return (
    <div className="status-panel" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;

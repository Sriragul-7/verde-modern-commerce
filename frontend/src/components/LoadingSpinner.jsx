const LoadingSpinner = ({ label = "Loading", compact = false }) => {
  return (
    <div className={compact ? "flex items-center justify-center py-10" : "flex min-h-[60vh] items-center justify-center"}>
      <div className="glass-panel rounded-[2rem] px-8 py-6 text-center">
        <div className="mx-auto h-14 w-14 rounded-full border-2 border-emerald-100/20 border-t-emerald-300 animate-spin" />
        <p className="mt-4 text-sm uppercase tracking-[0.24em] text-emerald-100/70">{label}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

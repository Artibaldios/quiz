interface ScrollButtonProps {
  direction: "left" | "right";
  onClick: () => void;
}

export default function ScrollButton({ direction, onClick }: ScrollButtonProps) {
  const isLeft = direction === "left";

  return (
    <button
      onClick={onClick}
      className="group relative w-11 h-11 glass backdrop-blur-xl border border-white/50 dark:border-zinc-700/50 rounded-2xl shadow-lg hover:shadow-xl dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] active:shadow-md active:scale-95 transition-all duration-200 ease-out flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
      aria-label={`Scroll ${direction}`}
      type="button"
    >
      <svg
        className={`w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 group-active:text-zinc-900 transition-colors duration-200 ${
          isLeft ? "" : "rotate-180"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <div className="absolute inset-0 bg-linear-to-r from-white/30 dark:from-zinc-800/20 to-transparent rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>
  );
}
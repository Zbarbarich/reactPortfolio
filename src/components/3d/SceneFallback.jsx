const SceneFallback = () => (
  <div
    className="w-full h-full flex items-center justify-center"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 200 240"
      className="w-48 h-56 sm:w-64 sm:h-72 drop-shadow-2xl"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="botBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d3748" />
          <stop offset="100%" stopColor="#1a202c" />
        </linearGradient>
        <linearGradient id="botGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4fd1c5" />
          <stop offset="100%" stopColor="#535bf2" />
        </linearGradient>
      </defs>
      {/* Antenna */}
      <line x1="100" y1="28" x2="100" y2="48" stroke="#4a5568" strokeWidth="4" />
      <circle cx="100" cy="22" r="8" fill="#535bf2" />
      {/* Head */}
      <rect x="55" y="48" width="90" height="70" rx="12" fill="url(#botBody)" />
      <rect x="62" y="58" width="76" height="48" rx="8" fill="#1a202c" />
      <rect x="72" y="72" width="24" height="14" rx="3" fill="#4fd1c5" />
      <rect x="104" y="72" width="24" height="14" rx="3" fill="#4fd1c5" />
      <rect x="86" y="94" width="28" height="6" rx="2" fill="#535bf2" />
      {/* Ears */}
      <rect x="42" y="68" width="14" height="28" rx="4" fill="#4a5568" />
      <rect x="144" y="68" width="14" height="28" rx="4" fill="#4a5568" />
      {/* Body */}
      <rect x="60" y="125" width="80" height="70" rx="10" fill="url(#botBody)" />
      <rect x="78" y="140" width="44" height="32" rx="6" fill="url(#botGlow)" opacity="0.85" />
      {/* Arms */}
      <rect x="32" y="135" width="22" height="55" rx="6" fill="#1a202c" />
      <rect x="146" y="135" width="22" height="55" rx="6" fill="#1a202c" />
      {/* Legs */}
      <rect x="72" y="200" width="24" height="28" rx="4" fill="#1a202c" />
      <rect x="104" y="200" width="24" height="28" rx="4" fill="#1a202c" />
    </svg>
  </div>
)

export default SceneFallback

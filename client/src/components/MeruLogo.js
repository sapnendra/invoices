export default function MeruLogo({ className = "w-full h-full", showText = true }) {
  return (
    <svg 
      viewBox="0 0 200 60" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mountain/Triangle Design */}
      <g>
        {/* Left triangle */}
        <path
          d="M 10 45 L 25 15 L 40 45 Z"
          fill="#5B7FE8"
        />
        {/* Middle triangle (lighter) */}
        <path
          d="M 25 45 L 40 15 L 55 45 Z"
          fill="#7B9FF5"
        />
        {/* Right triangle (darkest) */}
        <path
          d="M 35 30 L 45 15 L 55 30 Z"
          fill="#4A5FD8"
        />
        {/* Arrow overlay */}
        <path
          d="M 20 20 L 35 5 L 50 20 L 45 20 L 45 25 L 25 25 L 25 20 Z"
          fill="#6B8FF8"
        />
      </g>

      {showText && (
        <>
          {/* MERU Text */}
          <text
            x="70"
            y="30"
            fontFamily="Arial, sans-serif"
            fontSize="22"
            fontWeight="bold"
            fill="#2D3748"
          >
            MERU
          </text>
          
          {/* Registered Trademark */}
          <circle cx="145" cy="18" r="5" fill="none" stroke="#2D3748" strokeWidth="0.8" />
          <text
            x="143"
            y="21"
            fontFamily="Arial, sans-serif"
            fontSize="6"
            fontWeight="bold"
            fill="#2D3748"
          >
            R
          </text>

          {/* Technosoft Text */}
          <text
            x="70"
            y="45"
            fontFamily="Arial, sans-serif"
            fontSize="12"
            fontWeight="400"
            fill="#4A5568"
          >
            Technosoft
          </text>
        </>
      )}
    </svg>
  );
}

export function MeruLogoIcon({ className = "w-full h-full" }) {
  return (
    <svg 
      viewBox="0 0 60 50" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mountain/Triangle Design */}
      <g>
        {/* Left triangle */}
        <path
          d="M 5 40 L 20 10 L 35 40 Z"
          fill="#5B7FE8"
        />
        {/* Middle triangle (lighter) */}
        <path
          d="M 20 40 L 35 10 L 50 40 Z"
          fill="#7B9FF5"
        />
        {/* Right triangle (darkest) */}
        <path
          d="M 30 25 L 40 10 L 50 25 Z"
          fill="#4A5FD8"
        />
        {/* Arrow overlay */}
        <path
          d="M 15 15 L 30 0 L 45 15 L 40 15 L 40 20 L 20 20 L 20 15 Z"
          fill="#6B8FF8"
        />
      </g>
    </svg>
  );
}

interface AnimatedBlobsProps {
  theme: 'light' | 'dark'
  isVisible?: boolean
}

/**
 * Animated SVG background with rocket-shaped gradients launching upwards
 * Creates a dynamic, futuristic effect for the hero section
 * @param theme Current theme (light/dark) for color adaptation
 * @param isVisible Controls visibility with fade animation
 */
export function AnimatedBlobs({ theme, isVisible = true }: AnimatedBlobsProps) {
  const rockets = [
    {
      id: 1,
      color: theme === 'light' ? '#3B82F6' : '#60A5FA',
      startX: 15,
      startY: 100,
      endX: 25,
      endY: -20,
      duration: 10,
      delay: 0,
      size: 1,
    },
    {
      id: 2,
      color: theme === 'light' ? '#8B5CF6' : '#A78BFA',
      startX: 50,
      startY: 100,
      endX: 55,
      endY: -20,
      duration: 12,
      delay: 3.5,
      size: 1.2,
    },
    {
      id: 3,
      color: theme === 'light' ? '#EC4899' : '#06B6D4',
      startX: 75,
      startY: 100,
      endX: 80,
      endY: -20,
      duration: 11,
      delay: 7,
      size: 0.9,
    },
  ]

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none transition-opacity duration-500"
      style={{
        zIndex: 0,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          minHeight: '100vh',
        }}
      >
        <defs>
          {/* Motion blur filter */}
          <filter id="motion-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0,8" />
          </filter>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="10" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient definitions for each rocket */}
          {rockets.map((rocket) => (
            <linearGradient
              key={`gradient-${rocket.id}`}
              id={`rocket-gradient-${rocket.id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={rocket.color} stopOpacity="0.9" />
              <stop offset="50%" stopColor={rocket.color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={rocket.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {rockets.map((rocket) => (
          <g key={rocket.id}>
            {/* Rocket body with trail */}
            <ellipse
              className="rocket"
              cx="0"
              cy="0"
              rx={40 * rocket.size}
              ry={180 * rocket.size}
              fill={`url(#rocket-gradient-${rocket.id})`}
              filter="url(#motion-blur)"
              style={{
                transformOrigin: 'center',
                animation: `rocket-launch-${rocket.id} ${rocket.duration}s ease-in infinite`,
                animationDelay: `${rocket.delay}s`,
              }}
            />

            {/* Glow effect at rocket base */}
            <circle
              className="rocket-glow"
              cx="0"
              cy="0"
              r={30 * rocket.size}
              fill={rocket.color}
              opacity="0"
              filter="url(#glow)"
              style={{
                animation: `rocket-glow-${rocket.id} ${rocket.duration}s ease-in infinite`,
                animationDelay: `${rocket.delay}s`,
              }}
            />

            {/* Particle trail */}
            {[...Array(5)].map((_, i) => (
              <circle
                key={`particle-${rocket.id}-${i}`}
                className="trail-particle"
                cx="0"
                cy="0"
                r={3 + i}
                fill={rocket.color}
                opacity="0"
                style={{
                  animation: `particle-trail-${rocket.id} ${rocket.duration}s ease-out infinite`,
                  animationDelay: `${rocket.delay + i * 0.15}s`,
                }}
              />
            ))}
          </g>
        ))}
      </svg>

      <style jsx>{`
        /* Rocket 1 Launch Animation */
        @keyframes rocket-launch-1 {
          0% {
            transform: translate(15vw, 100vh) scale(0.5) rotate(-15deg);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(25vw, -20vh) scale(1.2) rotate(-10deg);
            opacity: 0;
          }
        }

        @keyframes rocket-glow-1 {
          0% {
            transform: translate(15vw, 100vh);
            opacity: 0.6;
          }
          85% {
            opacity: 0.6;
          }
          100% {
            transform: translate(25vw, -20vh);
            opacity: 0;
          }
        }

        @keyframes particle-trail-1 {
          0% {
            transform: translate(15vw, 100vh) scale(1);
            opacity: 0.8;
          }
          15% {
            opacity: 0.8;
          }
          30% {
            transform: translate(calc(15vw + 10px), calc(100vh + 50px))
              scale(0.5);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        /* Rocket 2 Launch Animation */
        @keyframes rocket-launch-2 {
          0% {
            transform: translate(50vw, 100vh) scale(0.5) rotate(-12deg);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(55vw, -20vh) scale(1.3) rotate(-8deg);
            opacity: 0;
          }
        }

        @keyframes rocket-glow-2 {
          0% {
            transform: translate(50vw, 100vh);
            opacity: 0.7;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translate(55vw, -20vh);
            opacity: 0;
          }
        }

        @keyframes particle-trail-2 {
          0% {
            transform: translate(50vw, 100vh) scale(1);
            opacity: 0.8;
          }
          15% {
            opacity: 0.8;
          }
          30% {
            transform: translate(calc(50vw + 8px), calc(100vh + 60px))
              scale(0.5);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        /* Rocket 3 Launch Animation */
        @keyframes rocket-launch-3 {
          0% {
            transform: translate(75vw, 100vh) scale(0.5) rotate(-18deg);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(80vw, -20vh) scale(1.1) rotate(-12deg);
            opacity: 0;
          }
        }

        @keyframes rocket-glow-3 {
          0% {
            transform: translate(75vw, 100vh);
            opacity: 0.5;
          }
          85% {
            opacity: 0.5;
          }
          100% {
            transform: translate(80vw, -20vh);
            opacity: 0;
          }
        }

        @keyframes particle-trail-3 {
          0% {
            transform: translate(75vw, 100vh) scale(1);
            opacity: 0.8;
          }
          15% {
            opacity: 0.8;
          }
          30% {
            transform: translate(calc(75vw + 12px), calc(100vh + 45px))
              scale(0.5);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rocket,
          .rocket-glow,
          .trail-particle {
            animation: none !important;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          @keyframes rocket-launch-1 {
            0% {
              transform: translate(20vw, 100vh) scale(0.4) rotate(-15deg);
              opacity: 1;
            }
            100% {
              transform: translate(30vw, -20vh) scale(0.8) rotate(-10deg);
              opacity: 0;
            }
          }

          @keyframes rocket-launch-2 {
            0% {
              transform: translate(50vw, 100vh) scale(0.4) rotate(-12deg);
              opacity: 1;
            }
            100% {
              transform: translate(55vw, -20vh) scale(0.9) rotate(-8deg);
              opacity: 0;
            }
          }

          @keyframes rocket-launch-3 {
            0% {
              transform: translate(70vw, 100vh) scale(0.4) rotate(-18deg);
              opacity: 1;
            }
            100% {
              transform: translate(75vw, -20vh) scale(0.7) rotate(-12deg);
              opacity: 0;
            }
          }
        }
      `}</style>
    </div>
  )
}


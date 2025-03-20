import React, { useEffect, useState } from "react";

interface ConfettiProps {
  active: boolean;
}

interface ConfettiPiece {
  id: number;
  style: {
    position: "absolute";
    backgroundColor: string;
    width: string;
    height: string;
    borderRadius: string;
    left: string;
    top: string;
    opacity: number;
    transform: string;
    animation: string;
  };
}

const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    // Generate confetti pieces
    const colors = ["#0a84ff", "#30d158", "#ffd60a", "#ff453a", "#bf5af2"];
    const newPieces = Array.from({ length: 50 }, (_, i) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 0.8 + 0.4; // 0.4 to 1.2rem
      const left = Math.random() * 100; // 0-100%
      const spinDirection = Math.random() > 0.5 ? 1 : -1;
      const spinSpeed = Math.random() * 35 + 5; // 5-40

      return {
        id: i,
        style: {
          position: "absolute" as const,
          backgroundColor: color,
          width: `${size}rem`,
          height: `${size * 0.4}rem`,
          borderRadius: "2px",
          left: `${left}%`,
          top: "-20px",
          opacity: Math.random() * 0.6 + 0.4, // 0.4-1.0
          transform: `rotate(${Math.random() * 360}deg)`,
          animation: `confetti-fall ${Math.random() * 2 + 2}s linear forwards, 
                      confetti-spin ${spinSpeed}s ${
            spinDirection < 0 ? "reverse" : ""
          } linear infinite`,
        },
      };
    });

    setPieces(newPieces);

    // Cleanup confetti after animation
    const timer = setTimeout(() => {
      setPieces([]);
    }, 4000);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active && pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 flex justify-center overflow-hidden z-50">
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            top: -20px;
          }
          100% {
            top: 100vh;
          }
        }
        @keyframes confetti-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {pieces.map((piece) => (
        <div key={piece.id} style={piece.style} />
      ))}
    </div>
  );
};

export default Confetti;

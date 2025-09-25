import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiCelebrationProps {
  trigger?: boolean;
  onComplete?: () => void;
  className?: string;
}

const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  trigger = false,
  onComplete,
  className = ''
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleCelebrate = useCallback(() => {
    setIsActive(true);
    
    // Play celebration sound (if available)
    try {
      const audio = new Audio('/sounds/celebration.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio errors (file might not exist)
      });
    } catch (error) {
      // Ignore audio errors
    }

    setTimeout(() => {
      setIsActive(false);
      if (onComplete) onComplete();
    }, 3000);
  }, [onComplete]);

  React.useEffect(() => {
    if (trigger) {
      handleCelebrate();
    }
  }, [trigger, handleCelebrate]);

  return (
    <div className={`relative ${className}`}>
      {/* Celebration Button */}
      <motion.button
        onClick={handleCelebrate}
        className="w-full py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        disabled={isActive}
      >
        {/* Button background animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500"
          animate={isActive ? { x: ['-100%', '100%'] } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isActive ? (
            <>
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                🎉
              </motion.span>
              Celebrating...
            </>
          ) : (
            <>
              🎊 Celebrate Milestone 🎊
            </>
          )}
        </span>
      </motion.button>

      {/* Confetti Animation */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Main confetti burst */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: [
                    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
                    '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
                    '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24'
                  ][i % 12],
                  left: '50%',
                  top: '50%'
                }}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  rotate: 0
                }}
                animate={{
                  scale: [0, 1, 0.8, 0],
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  rotate: Math.random() * 720
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.02,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Sparkle effects */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 1.5,
                  delay: Math.random() * 2,
                  repeat: 2,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Celebration text popup */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl shadow-2xl z-10"
              initial={{ scale: 0, rotate: -10, y: 0 }}
              animate={{ 
                scale: [0, 1.2, 1], 
                rotate: [0, 5, 0], 
                y: [-20, -40, -20] 
              }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 500, 
                damping: 30 
              }}
            >
              <motion.div
                animate={{ 
                  textShadow: [
                    '0 0 0px rgba(255,255,255,0)',
                    '0 0 20px rgba(255,255,255,0.8)',
                    '0 0 0px rgba(255,255,255,0)'
                  ]
                }}
                transition={{ duration: 1, repeat: 2 }}
              >
                🎉 MILESTONE UNLOCKED! 🎉
              </motion.div>
              <div className="text-sm font-normal mt-1 text-center">
                Amazing work, keep it up!
              </div>
            </motion.div>

            {/* Firework bursts */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`firework-${i}`}
                className="absolute"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${20 + i * 20}%`
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{ 
                  duration: 1, 
                  delay: 0.5 + i * 0.3,
                  ease: "easeOut"
                }}
              >
                {Array.from({ length: 8 }).map((_, j) => (
                  <motion.div
                    key={j}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{ x: 0, y: 0, scale: 0 }}
                    animate={{
                      x: Math.cos((j * Math.PI * 2) / 8) * 50,
                      y: Math.sin((j * Math.PI * 2) / 8) * 50,
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.5 + i * 0.3,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </motion.div>
            ))}

            {/* Glowing aura */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-yellow-400/20 via-orange-500/10 to-transparent rounded-xl"
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: 1,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfettiCelebration;

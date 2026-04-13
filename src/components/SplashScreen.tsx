import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      {/* Background Orbs for Splash */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[70vw] h-[70vw] bg-[#0D518E]/20 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-20%] w-[80vw] h-[80vw] bg-[#FAB515]/15 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.img
        src="https://res.cloudinary.com/ddtpuucfi/image/upload/v1776089289/CHARGE_3_afxm8u.png"
        alt="Fotus Charge"
        className="w-72 md:w-96 h-auto relative z-10"
        initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
}

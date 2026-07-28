// components/AnimatedSection.tsx

import { motion, Variants } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string; 
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', delay = 0, id }) => {
  
  const sectionVariants: Variants = {
    initial: { opacity: 0, y: 32, scale: 0.98 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      id={id} 
      variants={sectionVariants}
      initial="initial"
      whileInView="whileInView"
      transition={{ type: "spring", stiffness: 80, damping: 16, delay }}
      viewport={{ once: true }}
      className={`window-panel texture-droplets w-full max-w-5xl p-6 md:p-8 ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default AnimatedSection;

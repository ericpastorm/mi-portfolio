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
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      id={id} 
      variants={sectionVariants}
      initial="initial"
      whileInView="whileInView"
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      viewport={{ once: true }}
      className={`w-full max-w-5xl bg-[rgb(var(--panel-background))] rounded-2xl p-6 md:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
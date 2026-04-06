import { motion } from "framer-motion";

export function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className="animate-fade-slide"
    >
      {children}
    </motion.div>
  );
}


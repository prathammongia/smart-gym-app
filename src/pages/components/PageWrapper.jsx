import { motion } from "framer-motion";

const slideVariants = {
  initial: (direction) => ({
    x: direction === "left" ? "-100%" : "100%",
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4 },
  },
  exit: (direction) => ({
    x: direction === "left" ? "100%" : "-100%",
    opacity: 0,
    transition: { duration: 0.4 },
  }),
};

export default function PageWrapper({ children, direction = "right" }) {
  return (
    <motion.div
      className="page"
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={direction}
    >
      {children}
    </motion.div>
  );
}

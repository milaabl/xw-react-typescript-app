import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const FadeRight = ({ children, className }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeRight;

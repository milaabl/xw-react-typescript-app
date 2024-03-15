import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const FadeInBlur = ({ children, className }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInBlur;

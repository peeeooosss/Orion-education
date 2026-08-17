export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const springPop = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
};

export const springBtn = {
  type: "spring" as const,
  stiffness: 400,
  damping: 17,
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

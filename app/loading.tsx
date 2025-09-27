'use client';

import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';

export default function LoadingPage() {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 200
      }
    }
  };

  const dotsVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="text-center max-w-sm mx-auto px-6"
      >
        {/* Logo Animation */}
        <motion.div
          variants={logoVariants}
          className="relative mb-8"
        >
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Bot className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Sparkle Effects */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.h1
          variants={itemVariants}
          className="text-2xl font-bold text-foreground mb-2"
        >
          Loading SudoPath
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-muted-foreground mb-6"
        >
          Preparing your AI co-founder experience...
        </motion.p>

        {/* Loading Animation */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center space-x-2 mb-6"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              variants={dotsVariants}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut'
              }}
              className="w-3 h-3 bg-primary rounded-full"
            />
          ))}
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          variants={itemVariants}
          className="space-y-2 text-left max-w-xs mx-auto"
        >
          {[
            'Initializing AI systems...',
            'Loading conversation engine...',
            'Connecting to Base network...',
            'Preparing your workspace...'
          ].map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 1 + index * 0.3,
                duration: 0.5
              }}
              className="flex items-center space-x-2 text-sm text-muted-foreground"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 1.2 + index * 0.3,
                  type: 'spring',
                  stiffness: 300
                }}
                className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"
              />
              <span>{step}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="mt-8 pt-6 border-t border-border"
        >
          <p className="text-xs text-muted-foreground italic">
            💡 Did you know? The average solo founder spends 6+ months going from idea to first revenue.
            SudoPath helps you do it in weeks.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}


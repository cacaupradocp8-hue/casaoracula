import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FRASES = [
  "Silenciando os ruídos externos...",
  "Observando as tensões da paisagem...",
  "Revelando sua CidadELA Interior..."
];

export const RevelacaoLoader: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % FRASES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm p-6">
      <motion.div
        animate={{ 
          rotate: 360,
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-24 h-24 border-2 border-gold/20 border-t-gold rounded-full mb-12"
      />
      
      <div className="h-8 overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="text-gold/80 font-display italic tracking-wide"
          >
            {FRASES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

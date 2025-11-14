"use client"
import React from "react";
import { motion } from "framer-motion";

// FullPageLoader (efeito de revelação vertical)
// A logo é revelada de cima para baixo com um gradiente que desliza e desaparece.
// Uso: <FullPageLoader logoSrc="/img/ruraltech-logo.svg" />

export default function FullPageLoader({ logoSrc = "/img/ruraltech-logo.svg" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative flex items-center justify-center overflow-hidden">
        {/* máscara de revelação */}
        <motion.div
          initial={{ height: "0%" }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary/30 to-transparent"
        />

        {/* logo com leve fade-in e escala */}
        <motion.img
          src={logoSrc}
          alt="RuralTech"
          initial={{ opacity: 0, scale: 1.1, y: -40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
          className="h-24 w-auto z-10"
        />

        {/* brilho que desce sobre a logo */}
        <motion.div
          initial={{ y: "-120%", opacity: 0.3 }}
          animate={{ y: "120%", opacity: [0.3, 0.6, 0] }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
          className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent via-white/30 to-transparent mix-blend-overlay"
        />
      </div>

      {/* pequena animação de fade-out geral */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute inset-0 bg-background"
      />

      {/* acessibilidade */}
      <div className="sr-only" role="status" aria-live="polite">Carregando</div>
    </div>
  );
}
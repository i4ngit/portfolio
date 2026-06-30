"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, ChevronDown, Linkedin } from "lucide-react";
import type { HeroContent } from "@/lib/types";
import { motion } from "framer-motion";

interface HeroProps {
  hero: HeroContent;
}

export default function Hero({ hero }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center bg-slate-text overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Gradient overlay — fades bottom to white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <div className="relative section-container flex flex-col md:flex-row items-center gap-12 md:gap-16 pt-24 pb-20">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0"
        >
          <div className="w-44 h-44 md:w-56 md:h-56 rounded-full ring-4 ring-white/20 overflow-hidden bg-white/10">
            <Image
              src={hero.photoUrl}
              alt={hero.name}
              width={224}
              height={224}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center md:text-left"
        >
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-3">
            {hero.institution} · {hero.year}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            {hero.name}
          </h1>
          <p className="mt-3 text-xl text-white/80 font-light">{hero.headline}</p>
          <p className="mt-5 text-white/60 max-w-xl leading-relaxed text-sm">
            {hero.bio.split("\n\n")[0]}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
            <Link href="/research" className="btn-primary bg-white text-slate-text hover:bg-white/90">
              View Research
            </Link>
            <a
              href={hero.cvUrl}
              download
              className="btn-secondary border-white/40 text-white hover:bg-white hover:text-slate-text"
            >
              <FileText size={16} />
              Download CV
            </a>
            <a
              href={hero.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-white/40 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} />
      </motion.a>
    </section>
  );
}

import Image from "next/image";
import type { HeroContent } from "@/lib/types";
import { Mail, Linkedin, FileText } from "lucide-react";

interface HeroProps {
  hero: HeroContent;
}

export default function Hero({ hero }: HeroProps) {
  return (
    <section id="about" className="pt-12 pb-4">
      <div className="flex flex-col sm:flex-row items-start gap-7 sm:gap-10">
        {/* Photo */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-100 ring-1 ring-gray-200">
            <Image
              src={hero.photoUrl}
              alt={hero.name}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}>
            {hero.name}
          </h1>
          <p className="mt-1 text-gray-600 text-sm">{hero.headline}</p>
          {hero.institution && (
            <p className="mt-0.5 text-gray-400 text-xs">{hero.institution}</p>
          )}

          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            {hero.bio.split("\n\n")[0]}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {hero.email && (
              <a
                href={`mailto:${hero.email}`}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Mail size={12} />
                {hero.email}
              </a>
            )}
            {hero.linkedIn && (
              <a
                href={hero.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Linkedin size={12} />
                LinkedIn
              </a>
            )}
            {hero.cvUrl && (
              <a
                href={hero.cvUrl}
                download
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FileText size={12} />
                CV / Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

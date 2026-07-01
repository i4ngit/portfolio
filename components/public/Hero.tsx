import Link from "next/link";
import type { HeroContent } from "@/lib/types";
import { Linkedin, FileText } from "lucide-react";

interface HeroProps {
  hero: HeroContent;
}

export default function Hero({ hero }: HeroProps) {
  const firstParagraph = hero.bio.split("\n\n")[0];

  return (
    <section className="min-h-[88vh] flex items-center">
      <div className="wide-column w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-20 items-center">

          {/* ── Left: Text ───────────────────────────────── */}
          <div className="order-2 lg:order-1">
            {(hero.institution || hero.year) && (
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 mb-5">
                {[hero.institution, hero.year].filter(Boolean).join(" · ")}
              </p>
            )}

            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] leading-[1.04] text-gray-900 mb-7">
              {hero.headline}
            </h1>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg mb-9">
              {firstParagraph}
            </p>

            {/* Icon links */}
            <div className="flex items-center gap-2.5 mb-8">
              {hero.linkedIn && (
                <a
                  href={hero.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
              )}
              {hero.cvUrl && (
                <a
                  href={hero.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                  aria-label="View CV"
                >
                  <FileText size={15} />
                </a>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/#research" className="cta-primary">
                Selected work
              </Link>
              {hero.email && (
                <a href={`mailto:${hero.email}`} className="cta-secondary">
                  Email me
                </a>
              )}
            </div>

            {/* Affiliation logos — only shown when configured in admin */}
            {(hero.affiliations?.length ?? 0) > 0 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-black/10">
                {hero.affiliations!.map((a) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={a.id}
                    src={a.logoUrl}
                    alt={a.name}
                    className="h-16 w-auto object-contain"
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Photo ─────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <div className="rounded-2xl overflow-hidden w-full aspect-[3/4] max-h-[580px] bg-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.photoUrl || "/placeholder-photo.jpg"}
                alt={hero.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { getContact, getHero } from "@/lib/kv";
import SectionHeader from "@/components/public/SectionHeader";
import { Mail, Linkedin, FileText, Building2 } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };
export const revalidate = 60;

export default async function ContactPage() {
  const [contact, hero] = await Promise.all([getContact(), getHero()]);

  return (
    <div className="pt-20">
      <div className="section-container">
        <SectionHeader
          eyebrow="Contact"
          title="Get in Touch"
          description={
            contact.blurb ||
            "I welcome connections with fellow researchers, clinicians, and mentors."
          }
        />

        <div className="grid md:grid-cols-2 gap-12 items-start mt-12">
          {/* Contact links */}
          <div className="space-y-5">
            <a
              href={`mailto:${contact.email}`}
              className="card flex items-center gap-4 hover:border-navy transition-colors group"
            >
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-navy flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">Email</p>
                <p className="text-sm font-medium text-slate-text group-hover:text-navy transition-colors">
                  {contact.email}
                </p>
              </div>
            </a>

            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 hover:border-navy transition-colors group"
            >
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-navy flex-shrink-0">
                <Linkedin size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">LinkedIn</p>
                <p className="text-sm font-medium text-slate-text group-hover:text-navy transition-colors">
                  View Profile
                </p>
              </div>
            </a>

            <a
              href={contact.cvUrl}
              download
              className="card flex items-center gap-4 hover:border-navy transition-colors group"
            >
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-navy flex-shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">Curriculum Vitae</p>
                <p className="text-sm font-medium text-slate-text group-hover:text-navy transition-colors">
                  Download CV (PDF)
                </p>
              </div>
            </a>

            <div className="card flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-surface flex items-center justify-center text-muted flex-shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">Institution</p>
                <p className="text-sm font-medium text-slate-text">{contact.institution}</p>
                {contact.department && (
                  <p className="text-xs text-muted">{contact.department}</p>
                )}
              </div>
            </div>
          </div>

          {/* Decorative aside */}
          <div className="hidden md:flex flex-col justify-center items-start gap-4 pl-8 border-l border-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-navy">Currently</p>
            <p className="font-serif text-4xl text-slate-text/20 font-bold leading-tight select-none">
              {hero.institution}
            </p>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Open to shadowing opportunities, research collaborations, and mentorship discussions.
            </p>
            <div className="mt-4">
              <a href={`mailto:${contact.email}`} className="btn-primary">
                <Mail size={15} />
                Send an Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

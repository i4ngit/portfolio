import type { Metadata } from "next";
import { getContact } from "@/lib/kv";
import { Mail, Linkedin, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };
export const revalidate = 60;

export default async function ContactPage() {
  const contact = await getContact();

  return (
    <div className="page-column py-12">
      <h1
        className="text-xl font-bold text-gray-900 mb-8"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        Contact
      </h1>

      <p className="text-sm text-gray-600 leading-relaxed max-w-md mb-8">
        {contact.blurb ||
          "I'm always happy to connect about research opportunities, clinical experiences, or questions about my work. Feel free to reach out."}
      </p>

      <div className="space-y-3">
        {contact.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail size={13} className="text-gray-400" />
            <a
              href={`mailto:${contact.email}`}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {contact.email}
            </a>
          </div>
        )}
        {contact.linkedin && (
          <div className="flex items-center gap-2 text-sm">
            <Linkedin size={13} className="text-gray-400" />
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        )}
        {contact.cvUrl && (
          <div className="flex items-center gap-2 text-sm">
            <FileText size={13} className="text-gray-400" />
            <a
              href={contact.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              View CV
            </a>
          </div>
        )}
        {contact.institution && (
          <p className="text-xs text-gray-400 mt-4">
            {contact.institution}
            {contact.department && `, ${contact.department}`}
          </p>
        )}
      </div>
    </div>
  );
}

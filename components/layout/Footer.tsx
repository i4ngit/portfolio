import Link from "next/link";

interface FooterProps {
  name?: string;
}

export default function Footer({ name = "Ian Ocampo" }: FooterProps) {
  return (
    <footer className="border-t border-black/10 mt-20">
      <div className="wide-column py-8 flex items-center justify-between text-xs text-gray-400">
        <p>© {new Date().getFullYear()} {name}</p>
        <Link href="/admin/login" className="hover:text-gray-600 transition-colors">
          Admin
        </Link>
      </div>
    </footer>
  );
}

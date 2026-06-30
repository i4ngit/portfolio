import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getHobbies } from "@/lib/kv";

export const metadata: Metadata = { title: "Off the Clock" };
export const revalidate = 60;

export default async function OffTheClockPage() {
  const categories = await getHobbies();

  return (
    <div className="wide-column py-12">
      <div className="page-column">
        <p className="section-label">Off the Clock</p>
        <h1 className="section-heading">A few things outside the lab</h1>
      </div>

      {categories.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {categories.map((c) => {
            const cover = c.coverImage || c.images[0];
            return (
              <Link key={c.id} href={`/off-the-clock/${c.slug}`} className="group block">
                <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={c.name}
                      width={600}
                      height={750}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      No photos yet
                    </div>
                  )}
                </div>
                <p className="mt-3 font-display font-bold text-lg text-gray-900 group-hover:text-gray-600 transition-colors">
                  {c.name}
                </p>
                {c.tagline && <p className="text-sm text-gray-500 mt-0.5">{c.tagline}</p>}
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="page-column text-sm text-gray-400 py-6">Nothing here yet — check back soon.</p>
      )}
    </div>
  );
}

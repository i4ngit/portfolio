import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getHobbies } from "@/lib/kv";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getHobbies();
  const category = categories.find((c) => c.slug === slug);
  return { title: category ? category.name : "Off the Clock" };
}

export default async function HobbyCategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const categories = await getHobbies();
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  return (
    <div className="wide-column py-12">
      <div className="page-column">
        <Link href="/off-the-clock" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
          ← Back
        </Link>
        <p className="section-label mt-4">Off the Clock</p>
        <h1 className="section-heading">{category.name}</h1>
        {category.tagline && (
          <p className="text-sm text-gray-600 -mt-3 mb-6">{category.tagline}</p>
        )}
      </div>

      {category.images.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {category.images.map((src, i) => (
            <div key={src} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={src}
                alt={`${category.name} photo ${i + 1}`}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="page-column text-sm text-gray-400 py-6">No photos yet.</p>
      )}
    </div>
  );
}

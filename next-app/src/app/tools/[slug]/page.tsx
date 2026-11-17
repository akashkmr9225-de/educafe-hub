import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS, getToolBySlug, getAllToolSlugs } from "@/data/tool-registry";
import { ToolPageContent } from "@/components/sites/educafehub/ToolPageContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found — EduCafe Hub",
    };
  }

  return {
    title: `${tool.titleEn} | EduCafe Hub`,
    description: tool.descriptionEn,
    openGraph: {
      title: `${tool.titleEn} | EduCafe Hub`,
      description: tool.descriptionEn,
      type: "website",
      siteName: "EduCafe Hub",
      url: `https://educafehub.pages.dev/tools/${tool.slug}/`,
      images: [
        {
          url: "https://educafehub.pages.dev/og-image.png",
          width: 1200,
          height: 630,
          alt: "EduCafe Hub — free tools for schools and cyber cafes",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.titleEn} | EduCafe Hub`,
      description: tool.descriptionEn,
      images: ["https://educafehub.pages.dev/og-image.png"],
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolPageContent tool={tool} />;
}
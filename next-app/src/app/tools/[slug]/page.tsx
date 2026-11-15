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
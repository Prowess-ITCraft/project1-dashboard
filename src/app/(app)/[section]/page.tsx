import { notFound } from "next/navigation";
import { sections } from "@/features/sections/catalog";
import { SectionScreen } from "@/features/sections/section-screen";

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const spec = sections.find((item) => item.slug === section);
  if (!spec) notFound();
  return <SectionScreen spec={spec} />;
}

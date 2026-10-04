import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppShell from "../../components/AppShell";
import CrawlableContent from "../../components/CrawlableContent";
import StructuredData from "../../components/StructuredData";
import { getAllPrograms, resolveCatchAllRoute } from "../../lib/seo";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const STATIC_SLUGS = [
  ["programs"],
  ["guide"],
  ["calisthenics-room"],
  ["privacy"],
  ["terms"],
  ["login"],
  ["register"],
  ["cart"],
  ["create"],
  ["dashboard"],
  ["my-program"],
  ["my-workouts"],
  ["purchase-history"],
  ["chat"],
  ["auth", "callback"],
  ["success"],
  ["feedback"],
];

export async function generateStaticParams() {
  const programSlugs = getAllPrograms().flatMap((program) => [
    { slug: ["program", String(program.id)] },
    { slug: ["program", String(program.id), "content"] },
    // Backwards-compatible /programs/:id URLs redirect to /program/:id
    { slug: ["programs", String(program.id)] },
  ]);
  return [...STATIC_SLUGS.map((slug) => ({ slug })), ...programSlugs];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return resolveCatchAllRoute(slug).metadata;
}

export default async function CatchAll({ params }: PageProps) {
  const { slug } = await params;
  // Backwards compatibility: /programs/:id → /program/:id
  if (slug[0] === "programs" && slug[1]) {
    redirect(`/program/${slug[1]}`);
  }
  const route = resolveCatchAllRoute(slug);
  return (
    <>
      <StructuredData data={route.jsonLd} />
      {route.crawlable && <CrawlableContent content={route.crawlable} />}
      <AppShell />
    </>
  );
}
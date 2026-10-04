import type { Metadata } from "next";
import AppShell from "../components/AppShell";
import CrawlableContent from "../components/CrawlableContent";
import StructuredData from "../components/StructuredData";
import { homeCrawlable, homeJsonLd, homeMetadata } from "../lib/seo";

export const metadata: Metadata = homeMetadata();

export default function Home() {
  return (
    <>
      <StructuredData data={homeJsonLd()} />
      <CrawlableContent content={homeCrawlable()} />
      <AppShell />
    </>
  );
}
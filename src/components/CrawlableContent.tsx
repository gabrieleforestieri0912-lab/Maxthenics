import type { CrawlableContent as CrawlableContentData } from "@/lib/seo";

interface CrawlableContentProps {
  content: CrawlableContentData;
}

export default function CrawlableContent({ content }: CrawlableContentProps) {
  return (
    <div className="sr-only" aria-label={content.h1}>
      <h1>{content.h1}</h1>
      {content.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {content.list && content.list.length > 0 && (
        <ul>
          {content.list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
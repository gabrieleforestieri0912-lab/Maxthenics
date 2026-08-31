import type { JsonLd } from "@/lib/seo";

interface StructuredDataProps {
  data: JsonLd | JsonLd[];
}

export default function StructuredData({ data }: StructuredDataProps) {
  const scripts = Array.isArray(data) ? data : [data];
  if (scripts.length === 0) return null;

  return (
    <>
      {scripts.map((script, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(script).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
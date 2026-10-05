import React from "react";
import SEO from "../components/SEO";

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalPageProps {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  lastUpdated: string;
}

export default function LegalPage({
  seoTitle,
  seoDescription,
  eyebrow,
  title,
  intro,
  sections,
  lastUpdated,
}: LegalPageProps) {
  return (
    <div className="page-shell px-6 lg:px-8">
      <SEO title={seoTitle} description={seoDescription} />

      <div className="container-max max-w-3xl">
        <header className="mb-10">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title mt-3 text-3xl md:text-4xl">{title}</h1>
        </header>

        <div className="card p-7 md:p-9">
          <p className="prose-block">{intro}</p>

          {sections.map((section) => (
            <section key={section.heading} className="mt-8 first:mt-0">
              <h2 className="prose-subheading mt-0">{section.heading}</h2>
              <p className="prose-block">{section.body}</p>
            </section>
          ))}

          <p className="meta-mono mt-10 pt-6 border-t border-white/10">
            Ultimo aggiornamento: {lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}
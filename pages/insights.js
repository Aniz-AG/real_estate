import React from "react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Playfair_Display, Space_Grotesk } from "next/font/google";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});
const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const PLACEHOLDER_CARDS = [
  {
    title: "Market Pulse",
    description:
      "Weekly summary of price movements, listings, and demand signals.",
    tag: "Weekly",
  },
  {
    title: "Neighborhood Spotlight",
    description:
      "Deep dives into fast-growing micro-markets and upcoming localities.",
    tag: "Local",
  },
  {
    title: "Buyer Playbook",
    description:
      "Guides for first-time buyers, investors, and resale decisions.",
    tag: "Guides",
  },
  {
    title: "Policy & Finance",
    description:
      "Updates on loans, tax changes, and housing policies that matter.",
    tag: "Finance",
  },
];

export default function Insights() {
  return (
    <Layout>
      <SeoHead
        title="Real Estate Insights | VSK Holdings Real EstateHub"
        description="News, guides, and market insights for the real estate community."
      />
      <div className={`${bodyFont.className} bg-[#F7F7F7]`}>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(196,48,43,0.12),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(17,24,39,0.08),_transparent_45%)]" />
          <div className="container mx-auto px-4 py-20 relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow">
                <Sparkles className="h-4 w-4 text-[#C4302B]" />
                Launching soon
              </div>
              <h1
                className={`${displayFont.className} mt-6 text-4xl md:text-5xl font-bold text-gray-900`}
              >
                Real Estate Insights
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                A curated space for market commentary, city trends, and
                practical guides. Content will be published by the client once
                the newsroom opens.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="bg-[#C4302B] hover:bg-[#A52521] text-white rounded-full px-6">
                  Get notified
                </Button>
                <Button variant="outline" className="rounded-full px-6">
                  Submit an article
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-12">
            {PLACEHOLDER_CARDS.map((card) => (
              <Card
                key={card.title}
                className="border border-gray-200 shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="uppercase tracking-[0.15em]">
                      {card.tag}
                    </span>
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-4">
                  <p>{card.description}</p>
                  <div className="flex items-center gap-2 text-[#C4302B] font-semibold">
                    Coming soon <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <Card className="border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Editorial Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-semibold text-gray-800">Q2 Launch</p>
                    <p>City trend reports and monthly outlook.</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    Scheduled
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-semibold text-gray-800">Buyer Clinics</p>
                    <p>Step-by-step guidance for first-time buyers.</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    Planned
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Investor Series
                    </p>
                    <p>Yield benchmarks and rental market signals.</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    In review
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-lg bg-gray-900 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Get early access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-200">
                <p>
                  Be the first to receive newsletters and new market reports
                  once the newsroom goes live.
                </p>
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="rounded-lg px-4 py-3 text-sm text-gray-900"
                  />
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg">
                    Request access
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}

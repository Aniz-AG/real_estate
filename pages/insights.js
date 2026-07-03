import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ExternalLink, ArrowRight, Loader2 } from "lucide-react";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import Link from "next/link";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});
const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Insights() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using Economic Times India Real Estate RSS feed via RSS2JSON public API
         const rssUrl = encodeURIComponent(
          "https://realty.economictimes.indiatimes.com/rss/topstories"
        );
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`
        );

        if (!response.ok) throw new Error("Failed to fetch news");
        
        const data = await response.json();
        if (data.status === "ok") {
          setArticles(data.items);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const topStories = articles.slice(0, 3);
  const otherStories = articles.slice(3, 10); // Limit list to next 7 items for performance

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  // Helper to clean up standard RSS descriptions
  const cleanDescription = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <Layout>
      <SeoHead
        title="Real Estate Insights | VSK Holdings Real EstateHub"
        description="Latest news, trends, and market insights for the Indian real estate sector."
      />
      <div className={`${bodyFont.className} min-h-screen bg-[#F7F7F7]`}>
        {/* Header Section */}
        <section className="relative overflow-hidden bg-white border-b border-gray-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(196,48,43,0.05),_transparent_60%)]" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="max-w-3xl">
              <h1
                className={`${displayFont.className} text-4xl md:text-5xl font-bold text-gray-900`}
              >
                Market Insights & News
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Stay updated with the latest trends, policy changes, and market pulse across the Indian real estate landscape.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#C4302B] mb-4" />
              <p>Fetching the latest market insights...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600 max-w-2xl mx-auto">
              <p className="font-semibold">Unable to load news feed.</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <>
              {/* Top 3 Stories */}
              <div className="mb-12">
                <h2 className={`${displayFont.className} text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2`}>
                  Top Stories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topStories.map((article, index) => (
                    <Card
                      key={index}
                      className="group border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      {article.thumbnail && (
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                          <img
                            src={article.thumbnail}
                            alt={article.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardHeader className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(article.pubDate)}
                        </div>
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#C4302B] transition-colors">
                          <Link href={article.link} target="_blank" rel="noopener noreferrer">
                            {article.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {cleanDescription(article.description)}
                        </p>
                        <Link
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C4302B] hover:text-[#A52521] transition-colors"
                        >
                          Read full article <ArrowRight className="h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Remaining List */}
              {otherStories.length > 0 && (
                <div>
                  <h2 className={`${displayFont.className} text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2`}>
                    More Market Updates
                  </h2>
                  <div className="flex flex-col gap-4">
                    {otherStories.map((article, index) => (
                      <Link 
                        href={article.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        key={index}
                        className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
                      >
                        {article.thumbnail && (
                          <div className="hidden sm:block w-32 h-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <img
                              src={article.thumbnail}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(article.pubDate)}
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-[#C4302B] transition-colors">
                            {article.title}
                          </h3>
                        </div>
                        <div className="hidden md:flex items-center text-gray-400 group-hover:text-[#C4302B] transition-colors shrink-0">
                          <ExternalLink className="h-5 w-5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </Layout>
  );
}
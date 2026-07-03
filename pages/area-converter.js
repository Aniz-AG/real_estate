import React, { useMemo, useState } from "react";
import { ArrowRightLeft, MapPin, Scale } from "lucide-react";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Playfair_Display, Space_Grotesk } from "next/font/google";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});
const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Comprehensive list of Indian and International land units sorted alphabetically
const ALL_UNITS = [
  { label: "Acre", value: "acre", sqft: 43560 },
  { label: "Bigha", value: "bigha", sqft: 27225 },
  { label: "Biswa", value: "biswa", sqft: 1361.25 },
  { label: "Biswa Kacha", value: "biswakacha", sqft: 2722.5 },
  { label: "Cent", value: "cent", sqft: 435.6 },
  { label: "Chatak", value: "chatak", sqft: 45 },
  { label: "Decimal", value: "decimal", sqft: 435.6 },
  { label: "Dhur", value: "dhur", sqft: 68.06 },
  { label: "Gaj", value: "gaj", sqft: 9 },
  { label: "Ground", value: "ground", sqft: 2400 },
  { label: "Guntha", value: "guntha", sqft: 1089 },
  { label: "Hectare", value: "hectare", sqft: 107639 },
  { label: "Kanal", value: "kanal", sqft: 5445 },
  { label: "Katha", value: "katha", sqft: 1361.25 },
  { label: "Killa", value: "killa", sqft: 43560 },
  { label: "Lessa", value: "lessa", sqft: 144 },
  { label: "Marla", value: "marla", sqft: 272.25 },
  { label: "Murabba", value: "murabba", sqft: 1089000 },
  { label: "Pura", value: "pura", sqft: 108900 },
  { label: "Square Centimeter", value: "sqcm", sqft: 0.00107639 },
  { label: "Square Feet", value: "sqft", sqft: 1 },
  { label: "Square Inch", value: "sqin", sqft: 0.00694444 },
  { label: "Square Karam", value: "sqkaram", sqft: 30.25 },
  { label: "Square Kilometer", value: "sqkm", sqft: 10763910.4 },
  { label: "Square Meter", value: "sqm", sqft: 10.7639 },
  { label: "Square Mile", value: "sqmi", sqft: 27878400 },
  { label: "Square Yard", value: "sqyd", sqft: 9 },
];

const formatValue = (value) => {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 4,
  });
};

export default function AreaConverter() {
  const [fromUnit, setFromUnit] = useState("sqft");
  const [toUnit, setToUnit] = useState("acre");
  const [inputValue, setInputValue] = useState("1000");

  const conversion = useMemo(() => {
    const value = parseFloat(inputValue);
    const from = ALL_UNITS.find((unit) => unit.value === fromUnit);
    const to = ALL_UNITS.find((unit) => unit.value === toUnit);

    if (!from || !to || !Number.isFinite(value)) {
      return { sqft: null, result: null };
    }

    const sqft = value * from.sqft;
    const result = sqft / to.sqft;
    return { sqft, result };
  }, [inputValue, fromUnit, toUnit]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <Layout>
      <SeoHead
        title="Area Converter | VSK Holdings Real EstateHub"
        description="Convert land and property area units used across India."
      />
      <div
        className={`${bodyFont.className} min-h-screen bg-gradient-to-br from-[#FFF7F4] via-white to-[#F2F2F2]`}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(196,48,43,0.15),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(17,24,39,0.06),_transparent_45%)]" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                <MapPin className="h-4 w-4" />
                Comprehensive Indian Land Units
              </div>
              <h1
                className={`${displayFont.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}
              >
                Area Converter
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Convert land and property measurements across standard and regional Indian units. Built for buyers, sellers, and agents who need fast, reliable conversions.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8">
            <Card className="border border-gray-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-[#C4302B]" />
                  Convert Area Units
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      From
                    </label>
                    <div className="mt-2 flex flex-col gap-2">
                      <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4302B]/20"
                      />
                      <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4302B]/20"
                      >
                        {ALL_UNITS.map((unit) => (
                          <option key={`from-${unit.value}`} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleSwap}
                    className="rounded-full h-12 w-12 p-0 border-gray-200 text-gray-700 hover:bg-red-50"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </Button>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      To
                    </label>
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 h-[46px] flex items-center">
                        {formatValue(conversion.result)}
                      </div>
                      <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4302B]/20"
                      >
                        {ALL_UNITS.map((unit) => (
                          <option key={`to-${unit.value}`} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-900 text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Standardized to Square feet
                    </p>
                    <p className="text-2xl font-semibold">
                      {formatValue(conversion.sqft)} sq ft
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    For official land records, verify locally.
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Popular Conversions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {/* Rendering a few popular standard items statically for the side widget */}
                  {[
                    { label: "1 Bigha", sqft: 27225 },
                    { label: "1 Acre", sqft: 43560 },
                    { label: "1 Hectare", sqft: 107639 },
                    { label: "1 Biswa", sqft: 1361.25 },
                    { label: "1 Guntha", sqft: 1089 },
                    { label: "1 Square Yard", sqft: 9 },
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                    >
                      <span>{unit.label}</span>
                      <span className="font-semibold text-gray-800">
                        {formatValue(unit.sqft)} sq ft
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    About Land Units
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-3">
                  <p>
                    Regional units like <strong>Bigha</strong>, <strong>Biswa</strong>, <strong>Guntha</strong>, and <strong>Katha</strong> can slightly vary across different districts and states.
                  </p>
                  <p>
                    We use standard conversion metrics universally accepted for quick referencing. Always confirm with local revenue authorities for exact jurisdictional values.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
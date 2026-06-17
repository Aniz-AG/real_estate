import React, { useMemo, useState } from "react";
import { ArrowRightLeft, Info, MapPin, Scale } from "lucide-react";
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

const STATE_UNITS = [
  {
    state: "All India (General)",
    note: "Approximate values for quick reference. Units vary by state.",
    units: [
      { label: "Sq ft", value: "sqft", sqft: 1 },
      { label: "Sq yd", value: "sqyd", sqft: 9 },
      { label: "Sq m", value: "sqm", sqft: 10.7639 },
      { label: "Acre", value: "acre", sqft: 43560 },
      { label: "Hectare", value: "hectare", sqft: 107639 },
      { label: "Bigha (approx)", value: "bigha", sqft: 27225 },
      { label: "Katha (approx)", value: "katha", sqft: 1361.25 },
      { label: "Lessa (approx)", value: "lessa", sqft: 144 },
      { label: "Cent", value: "cent", sqft: 435.6 },
      { label: "Gaj", value: "gaj", sqft: 9 },
    ],
  },
  {
    state: "Gujarat",
    note: "Common land units in Gujarat.",
    units: [
      { label: "Sq ft", value: "sqft", sqft: 1 },
      { label: "Gaj", value: "gaj", sqft: 9 },
      { label: "Acre", value: "acre", sqft: 43560 },
      { label: "Bigha (Gujarat)", value: "bigha", sqft: 17424 },
      { label: "Hectare", value: "hectare", sqft: 107639 },
    ],
  },
  {
    state: "Maharashtra",
    note: "Guntha is commonly used for agricultural land.",
    units: [
      { label: "Sq ft", value: "sqft", sqft: 1 },
      { label: "Sq m", value: "sqm", sqft: 10.7639 },
      { label: "Guntha", value: "guntha", sqft: 1089 },
      { label: "Acre", value: "acre", sqft: 43560 },
      { label: "Hectare", value: "hectare", sqft: 107639 },
    ],
  },
  {
    state: "Tamil Nadu",
    note: "Cent is widely used for plots.",
    units: [
      { label: "Sq ft", value: "sqft", sqft: 1 },
      { label: "Cent", value: "cent", sqft: 435.6 },
      { label: "Acre", value: "acre", sqft: 43560 },
      { label: "Sq m", value: "sqm", sqft: 10.7639 },
    ],
  },
  {
    state: "West Bengal",
    note: "Bigha and katha vary by district; use for quick reference.",
    units: [
      { label: "Sq ft", value: "sqft", sqft: 1 },
      { label: "Lessa", value: "lessa", sqft: 144 },
      { label: "Katha", value: "katha", sqft: 720 },
      { label: "Bigha", value: "bigha", sqft: 14400 },
      { label: "Acre", value: "acre", sqft: 43560 },
    ],
  },
];

const getUnitsForState = (stateName) =>
  STATE_UNITS.find((item) => item.state === stateName) || STATE_UNITS[0];

const formatValue = (value) => {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 4,
  });
};

export default function AreaConverter() {
  const [stateName, setStateName] = useState(STATE_UNITS[0].state);
  const [fromUnit, setFromUnit] = useState("sqft");
  const [toUnit, setToUnit] = useState("acre");
  const [inputValue, setInputValue] = useState("1000");

  const stateConfig = useMemo(() => getUnitsForState(stateName), [stateName]);

  const availableUnits = stateConfig.units;

  const conversion = useMemo(() => {
    const value = parseFloat(inputValue);
    const from = availableUnits.find((unit) => unit.value === fromUnit);
    const to = availableUnits.find((unit) => unit.value === toUnit);

    if (!from || !to || !Number.isFinite(value)) {
      return { sqft: null, result: null };
    }

    const sqft = value * from.sqft;
    const result = sqft / to.sqft;
    return { sqft, result };
  }, [inputValue, fromUnit, toUnit, availableUnits]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <Layout>
      <SeoHead
        title="Area Converter | VSK Holdings Real EstateHub"
        description="Convert land and property area units by state."
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
                Location-aware unit conversions
              </div>
              <h1
                className={`${displayFont.className} text-4xl md:text-5xl font-bold text-gray-900 mb-4`}
              >
                Area Converter
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Convert land and property measurements with state-aware units.
                Built for buyers, sellers, and agents who need fast, reliable
                conversions.
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
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    State
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => {
                      const nextState = e.target.value;
                      const stateUnits = getUnitsForState(nextState).units;
                      setStateName(nextState);
                      setFromUnit(stateUnits[0].value);
                      setToUnit(stateUnits[1]?.value || stateUnits[0].value);
                    }}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4302B]/20"
                  >
                    {STATE_UNITS.map((state) => (
                      <option key={state.state} value={state.state}>
                        {state.state}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                    <Info className="h-3.5 w-3.5" />
                    {stateConfig.note}
                  </p>
                </div>

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
                        {availableUnits.map((unit) => (
                          <option key={unit.value} value={unit.value}>
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
                      <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        {formatValue(conversion.result)}
                      </div>
                      <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4302B]/20"
                      >
                        {availableUnits.map((unit) => (
                          <option key={unit.value} value={unit.value}>
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
                      Square feet
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
                    Quick Conversions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {availableUnits.slice(0, 6).map((unit) => (
                    <div
                      key={unit.value}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                    >
                      <span>1 {unit.label}</span>
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
                    Land units like bigha, katha, or guntha can differ across
                    districts. Use this tool for quick estimates and confirm
                    with local authorities for exact values.
                  </p>
                  <p>
                    Prefer modern units like sq ft, sq m, acre, or hectare when
                    comparing properties across cities.
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

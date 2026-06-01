import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import ProjectCard from "@/components/ProjectCard";
import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewProjects() {
  const { selectedCity } = useSelector((state) => state.property);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const query = selectedCity
          ? `?city=${encodeURIComponent(selectedCity)}`
          : "";
        const res = await fetch(`/api/property/projects${query}`);
        const data = await res.json();
        if (data?.success) {
          setProjects(data.projects || []);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Failed to load projects", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedCity]);

  return (
    <Layout>
      <SeoHead
        title="New Projects | EstateHub"
        description="Explore premium new projects curated for elite buyers."
      />

      <section className="bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#0F172A] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs uppercase tracking-[0.2em]">
              <Crown className="h-4 w-4 text-amber-300" />
              Elite Projects
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 font-display">
              New Projects in {selectedCity || "India"}
            </h1>
            <p className="text-white/70 text-lg mt-3">
              Curated launches, premium residences, and flagship developments by
              top builders.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-gray-500 py-12">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No projects found in {selectedCity || "this region"}.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
            <Sparkles className="h-4 w-4 text-[#C4302B]" />
            Exclusive builder access
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
            List your flagship project
          </h2>
          <p className="text-gray-500 mb-6 max-w-xl mx-auto">
            Showcase premium launches to qualified buyers searching for elite
            developments.
          </p>
          <Link href="/contact">
            <Button className="bg-[#C4302B] hover:bg-[#A52521] text-white px-8">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

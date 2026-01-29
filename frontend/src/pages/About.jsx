import React from "react";

const About = () => {
  return (
    <section className="px-6 py-16 bg-gradient-to-br from-white to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto text-gray-800">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-4">
          About <span className="text-blue-500">RealNest</span>
        </h1>

        <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-12">
          We’re not just about properties – we’re about people, trust, and smart
          decisions. RealNest is built to help you find your dream space with
          ease and confidence.
        </p>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="bg-white/70 backdrop-blur rounded-lg shadow-lg p-6 border border-blue-100 transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To simplify your property journey by offering transparency, expert
              guidance, and personalized experiences in buying, selling, or
              renting.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-lg shadow-lg p-6 border border-blue-100 transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To revolutionize real estate with technology and trust, becoming
              India’s most reliable and customer-focused platform.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">
            Our Core Values
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Transparency",
              "Innovation",
              "Customer First",
              "Trust",
              "Integrity",
              "Excellence",
            ].map((value) => (
              <div
                key={value}
                className="bg-white shadow text-blue-600 px-6 py-3 rounded-full border border-blue-100 hover:bg-blue-50 transition-all duration-300"
              >
                {value}
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-center text-blue-800 mb-4">
            Why Choose RealNest?
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-gray-700 text-[17px]">
            <li>✅ 100% verified listings and updated inventory</li>
            <li>✅ Expert local agents with deep market knowledge</li>
            <li>✅ Advanced filters and AI-based recommendations</li>
            <li>✅ 24/7 support from onboarding to move-in</li>
            <li>✅ Secure, transparent, and fast communication</li>
          </ul>
        </div>

        {/* CTA Box */}
        <div className="bg-white/90 rounded-lg shadow-lg text-center py-8 px-6 max-w-3xl mx-auto border border-blue-100 transition-all hover:shadow-xl duration-300">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            Join the RealNest Family
          </h2>
          <p className="text-gray-600 mb-4">
            Are you a real estate agent looking to grow your network or a
            customer ready to move? Let’s connect!
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;

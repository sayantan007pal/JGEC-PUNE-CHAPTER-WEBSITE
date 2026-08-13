"use client";

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { Star } from "lucide-react";

interface Slide {
  src: StaticImageData;
  alt: string;
}

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="flex items-center justify-center md:pt-8 md:pb-0 md:px-4">
      <div className="relative w-full max-w-7xl min-h-[65vh] md:min-h-[60vh] overflow-hidden md:rounded-2xl">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                Established 1961 • 50+ Years of Excellence
              </span>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-accent w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

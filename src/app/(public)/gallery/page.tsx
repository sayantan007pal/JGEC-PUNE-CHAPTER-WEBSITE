"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
// import alumni1 from "@/assets/Adip-da.jpg";
// import alumni2 from "@/assets/Pradeep-da.jpg";
// import alumni3 from "@/assets/Pushpal-da.jpg";
import meet2024 from "@/assets/meet-2024.jpg";
import meet2025 from "@/assets/meet-2025.jpg";
import meet2026_2 from "@/assets/2026-meet-2.jpg";
import meet2026_3 from "@/assets/2026-meet-3.jpg";
import associationLogo from "@/assets/Jalpaiguri-engineers-association.jpg";

const categories = ["All", "Reunions", "Events"];
// const categories = ["All", "Reunions", "Alumni", "Events"];

const galleryItems = [
  {
    id: 1,
    src: meet2024,
    alt: "Annual Alumni Reunion 2024",
    category: "Reunions",
  },
  {
    id: 2,
    src: meet2025,
    alt: "Annual Alumni Reunion 2025",
    category: "Reunions",
  },
  { id: 3, src: meet2026_2, alt: "Alumni Meet 2026", category: "Reunions" },
  {
    id: 4,
    src: meet2026_3,
    alt: "Alumni Gathering 2026",
    category: "Reunions",
  },
  // { id: 5, src: alumni1, alt: "Shri Adip Roy", category: "Alumni" },
  // { id: 6, src: alumni2, alt: "Cdr. Pradeep Bandyopadhyay", category: "Alumni" },
  // { id: 7, src: alumni3, alt: "Brig. Pushpal De, Retd.", category: "Alumni" },
  { id: 8, src: event1, alt: "Community Event", category: "Events" },
  { id: 9, src: event2, alt: "Alumni Celebration", category: "Events" },
  { id: 10, src: heroBanner, alt: "JGEC Campus", category: "Events" },
  {
    id: 11,
    src: associationLogo,
    alt: "Alumni Association Jalpaiguri Government Engineering College",
    category: "Events",
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredItems =
    selectedCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredItems.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === filteredItems.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner.src})` }}
        />
        <div className="absolute inset-0 overlay-gradient" />

        <div className="relative z-10 container-custom px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
            Gallery
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Relive the memorable moments from our events and gatherings
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group card-shadow"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-300 flex items-end">
                  <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <p className="text-white font-medium text-sm">{item.alt}</p>
                    <span className="text-white/70 text-xs">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-50"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 text-white/80 hover:text-white p-2 z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 text-white/80 hover:text-white p-2 z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="max-w-5xl max-h-[80vh] px-16 relative w-full h-full flex items-center justify-center">
            {/* Note: Lightbox might need proper image sizing or just use img tag for simplicity within complex lightbox flexbox, 
                 but Next.js Image is preferred. Let's strictly use Next.js Image if possible, but for lightbox logic 
                 sometimes standard img is easier for containment. The prompt requested next/image. 
                 I will use a div wrapper for relative positioning.
              */}
            <div className="relative w-full h-full">
              {/* 
                   Wait, 'fill' works if parent has relative/absolute and dimensions. 
                   The previous code used <img className="max-w-full max-h-[75vh] object-contain">. 
                   Next.js image with 'fill' and 'object-fit: contain' is similar.
                */}
              <Image
                src={filteredItems[currentImageIndex]?.src}
                alt={filteredItems[currentImageIndex]?.alt || "Gallery image"}
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute bottom-[-3rem] text-center w-full">
              <p className="text-white font-medium">
                {filteredItems[currentImageIndex]?.alt}
              </p>
              <span className="text-white/60 text-sm">
                {filteredItems[currentImageIndex]?.category}
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentImageIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">
            Share Your Photos
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Have photos from JGEC events? Share them with the community and help
            us preserve our memories.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Submit Photos
          </button>
        </div>
      </section>
    </div>
  );
}

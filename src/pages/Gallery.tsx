import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import alumni1 from "@/assets/alumni-1.jpg";
import alumni2 from "@/assets/alumni-2.jpg";
import alumni3 from "@/assets/alumni-3.jpg";

const categories = ["All", "Reunions", "Events", "Workshops", "Sports", "Cultural"];

const galleryItems = [
  { id: 1, src: heroBanner, alt: "Annual Reunion 2025", category: "Reunions" },
  { id: 2, src: event1, alt: "Networking Event", category: "Events" },
  { id: 3, src: event2, alt: "Graduation Ceremony", category: "Events" },
  { id: 4, src: alumni1, alt: "Leadership Summit", category: "Workshops" },
  { id: 5, src: alumni2, alt: "Women in Tech Panel", category: "Workshops" },
  { id: 6, src: alumni3, alt: "Tech Talk Session", category: "Workshops" },
  { id: 7, src: event1, alt: "Cricket Tournament", category: "Sports" },
  { id: 8, src: event2, alt: "Family Day Picnic", category: "Reunions" },
  { id: 9, src: heroBanner, alt: "Silver Jubilee Batch", category: "Reunions" },
  { id: 10, src: alumni1, alt: "Cultural Night", category: "Cultural" },
  { id: 11, src: alumni2, alt: "Diwali Celebration", category: "Cultural" },
  { id: 12, src: event1, alt: "Mentorship Session", category: "Workshops" },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredItems = selectedCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? filteredItems.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === filteredItems.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
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
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-300 flex items-end">
                  <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-medium text-sm">{item.alt}</p>
                    <span className="text-white/70 text-xs">{item.category}</span>
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
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 text-white/80 hover:text-white p-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 text-white/80 hover:text-white p-2"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="max-w-5xl max-h-[80vh] px-16">
            <img
              src={filteredItems[currentImageIndex]?.src}
              alt={filteredItems[currentImageIndex]?.alt}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-white font-medium">{filteredItems[currentImageIndex]?.alt}</p>
              <span className="text-white/60 text-sm">{filteredItems[currentImageIndex]?.category}</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentImageIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}

      {/* Video Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Videos
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Event Highlights
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden card-shadow">
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-accent border-b-8 border-b-transparent ml-1" />
                    </div>
                    <p className="text-muted-foreground text-sm">Video coming soon</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-bold text-card-foreground">
                    Annual Reunion 202{4 + i}
                  </h3>
                  <p className="text-muted-foreground text-sm">Event highlights video</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">
            Share Your Photos
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Have photos from JGEC events? Share them with the community and 
            help us preserve our memories.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Submit Photos
          </button>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

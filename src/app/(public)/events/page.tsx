"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, ArrowRight, Filter } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import meet2024 from "@/assets/meet-2024.jpg";
import meet2025 from "@/assets/meet-2025.jpg";

const featuredPastEvents = [
  {
    id: 1,
    title: "Annual Alumni Reunion 2024",
    date: "December 2024",
    location: "Pune",
    image: meet2024,
    description: "A memorable gathering of JALPAIGURI ENGINEERS ASSOCIATION members, reconnecting old friends and celebrating our shared legacy.",
  },
  {
    id: 2,
    title: "Annual Alumni Reunion 2025",
    date: "December 2025",
    location: "Pune",
    image: meet2025,
    description: "Another successful reunion bringing together our alumni community for an evening of networking and nostalgia.",
  },
];

const events = [
  {
    id: 1,
    title: "Annual Alumni Reunion 2026",
    date: "December, 2026",
    time: "6:00 PM - 11:00 PM",
    location: "To be announced",
    image: event1,
    description: "Join us for the biggest gathering of JALPAIGURI ENGINEERS ASSOCIATION this year. Network with fellow alumni, enjoy cultural programs, and relive your college memories.",
    category: "Reunion",
    featured: true,
  },
];

const categories = ["All", "Reunion"];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const featuredEvents = events.filter(event => event.featured);

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
            Events
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Connect, celebrate, and grow together at our curated events
          </p>
        </div>
      </section>

      {/* Featured Events */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Highlights
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Previous Events
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredPastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-card rounded-2xl overflow-hidden card-shadow hover:elevated-shadow transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-card-foreground mb-3">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4 text-accent" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 text-accent" />
                      {event.location}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Events */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                Event Calendar
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
                All Upcoming Events
              </h2>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-card rounded-xl overflow-hidden card-shadow hover:elevated-shadow transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs z-10">
                    {event.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-serif font-bold text-card-foreground mb-2">
                    {event.title}
                  </h3>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4 text-accent" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 text-accent" />
                      {event.location}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
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
            Want to Host an Event?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Have an idea for an alumni event? We'd love to hear from you! 
            Propose your event and we'll help make it happen.
          </p>
          <Button variant="hero" size="xl">
            Propose an Event
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

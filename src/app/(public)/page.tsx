import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JGEC Alumni Association Pune | Official Website",
  description: "Join the network of Jalpaiguri Government Engineering College alumni in Pune. Stay updated with events, mentorship programs, and success stories.",
};

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Award, BookOpen, Users } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import heroBanner from "@/assets/hero-banner.jpg";
import campusImage1 from "@/assets/Campus-image_1.jpg";
import campusImage2 from "@/assets/Campus_image_2.jpg";
import event1 from "@/assets/2026-meet-2.jpg";
import event2 from "@/assets/2026-meet-3.jpg";
import meet2024 from "@/assets/meet-2024.jpg";
import meet2025 from "@/assets/meet-2025.jpg";
import logo from "@/assets/JEAP_Logo_transparent_bg.png";

// const stats = [
//   { number: "5000+", label: "Alumni Members", icon: Users },
//   { number: "25+", label: "Member Benefits", icon: MapPin },
//   { number: "100+", label: "Annual Events", icon: Calendar },
//   { number: "50+", label: "Years of Legacy", icon: Award },
// ];

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "Celebrating and promoting excellence in all professional endeavors.",
  },
  {
    icon: BookOpen,
    title: "Mentorship",
    description: "Guiding current students and young alumni in their career journeys.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a supportive network that extends beyond geographical boundaries.",
  },
];

const pastEvents = [
  {
    title: "Annual Alumni Reunion 2024",
    location: "Pune",
    image: meet2024,
    description: "A memorable gathering of JGEC Alumni Association, Pune Chapter's members.",
  },
  {
    title: "Annual Alumni Reunion 2025",
    location: "Pune",
    image: meet2025,
    description: "Another successful reunion bringing together our alumni community for an evening of networking and nostalgia.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel
        slides={[
          { src: heroBanner, alt: "JGEC Campus" },
          { src: campusImage1, alt: "JGEC Campus" },
          { src: campusImage2, alt: "JGEC Campus" },
        ]}
          />
        
            
            
            


      {/* Stats Section */}
      {/* <section className="bg-primary py-16">
        <div className="container-custom px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-foreground/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* About Preview */}
      <section className="section-padding md:pt-2 bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                To foster a strong and engaged community of Jalpaiguri Government Engineering College Alumni Association 
                in Pune and other places by promoting meaningful connections, nurturing lifelong 
                relationships, encouraging collaboration, and contributing to our alma mater 
                and the wider community.
              </p>
              <Link href="/about">
                <Button variant="default" size="lg">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <Image src={logo} alt="Jalpaiguri Engineers Association" width={400} height={400} className="w-full max-w-sm object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-10 md:py-14 px-4 md:px-8 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Previous Events
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <div
                key={event.title}
                className="bg-card rounded-2xl overflow-hidden card-shadow hover:elevated-shadow transition-shadow duration-300"
              >
                <div className="relative h-56">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-card-foreground mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <Link href="/events">
                    <Button variant="outline" size="sm">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/events">
              <Button variant="default" size="lg">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card rounded-2xl p-6 card-shadow text-center hover:elevated-shadow transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-serif font-bold text-card-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
             src={heroBanner}
             alt="CTA Background"
             fill
             className="object-cover"
          />
        </div>
        <div className="absolute inset-0 overlay-gradient" />
        
        <div className="relative z-10 container-custom px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Become a part of the JGEC Alumni Association Pune and stay connected with
            your batchmates, access exclusive events, and contribute to our alma mater.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about">
              <Button variant="hero" size="xl">
                Become a Member
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="heroOutline" size="xl">
                Support Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

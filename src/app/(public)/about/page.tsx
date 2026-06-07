import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Handshake,
  Building2,
} from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const roadmap = [
  {
    year: "2024",
    title: "Foundation & Setup",
    icon: Building2,
    color: "bg-[#1a365d]",
    description:
      "Establish legal, operational, and digital frameworks required for sustainable growth.",
    items: [
      "Setting up governance structures",
      "Initiating membership drives",
      "Building a centralized database",
      "Launching digital infrastructure",
      "Building connections with college and alumni networks",
      "Establishing transparent financial systems",
    ],
  },
  {
    year: "2025",
    title: "Program Activation",
    icon: Handshake,
    color: "bg-[#6b7c3f]",
    description:
      "Create engagement with college and build partnerships with industry.",
    items: [
      "Implementing mentorship programs",
      "Hosting networking events",
      "Creating internship and scholarship opportunities",
      "Building collaborations with industry partners to support students and alumni",
    ],
  },
  {
    year: "2026",
    title: "Legacy Transformation",
    icon: Rocket,
    color: "bg-[#2d5016]",
    description: "Ensure lasting institutional impact.",
    items: [
      "Establishing a Sustainability Fund to finance college infrastructure upgrades",
      "Hosting a large-scale annual alumni meet",
      "Strengthening bridges between our global alumni chapters",
    ],
  },
];

const values = [
  {
    icon: Heart,
    title: "Brotherhood",
    description:
      "Fostering lifelong bonds among alumni regardless of batch or branch.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Celebrating and promoting excellence in all professional endeavors.",
  },
  {
    icon: BookOpen,
    title: "Mentorship",
    description:
      "Guiding current students and young alumni in their career journeys.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Building a supportive network that extends beyond geographical boundaries.",
  },
];

const benefits = [
  "Access to exclusive alumni networking events",
  "Career mentorship and guidance programs",
  "Job referrals and placement assistance",
  "Discounts on association events and merchandise",
  "Regular newsletters and updates",
  "Voting rights in association matters",
  "Access to alumni directory",
  "Recognition in achievement awards",
];

export default function AboutPage() {
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
            About Us
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Connecting generations of engineers, building bridges of opportunity
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="bg-card rounded-2xl p-8 md:p-12 card-shadow text-center max-w-4xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 mx-auto">
              <Target className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-card-foreground mb-4">
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
                Join hundreds of fellow alumni who have already made the Alumni Association Jalpaiguri Government Engineering College Pune Chapter their home away from home.
              nurturing lifelong relationships, encouraging collaboration, and
              contributing to our alma mater and the wider community.
            </p>
          </div>
        </div>
      </section>

      {/* Three Year Roadmap */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Our Strategy
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Three Year Roadmap
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roadmap.map((phase) => (
              <div
                key={phase.year}
                className="bg-card rounded-2xl overflow-hidden card-shadow hover:elevated-shadow transition-shadow duration-300"
              >
                <div className={`${phase.color} p-4 text-center`}>
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-white flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-foreground">
                      {phase.year.split(" ")[0]}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    {phase.year.split(" ")[1]}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <phase.icon className="w-6 h-6 text-accent" />
                    <h3 className="text-lg font-serif font-bold text-card-foreground">
                      {phase.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {phase.description}
                  </p>
                  <ul className="space-y-2">
                    {phase.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                Membership
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mt-3 mb-6">
                Benefits of Joining
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-8">
                As a member of the Alumni Association Jalpaiguri Government
                Engineering College Pune Chapter, you gain access to a wealth of
                resources, connections, and opportunities designed to support
                your professional and personal growth.
              </p>
              <Link href="/contact">
                <Button variant="hero" size="lg">
                  Join Today
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-white/10 rounded-2xl p-8">
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-primary-foreground/90">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Ready to Reconnect?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of fellow alumni who have already made the Alumni
            Association Jalpaiguri Government Engineering College Pune Chapter
            their home away from home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="default" size="xl">
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" size="xl">
                View Upcoming Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

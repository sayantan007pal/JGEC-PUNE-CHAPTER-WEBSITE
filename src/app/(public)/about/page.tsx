import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight, CheckCircle2, Rocket, Handshake, Building2, Linkedin } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import adipRoyImage from "@/assets/Adip-da.jpg";
import debashisMitraImage from "@/assets/debashisi_mitra.jpg";
import nilanjanSasmalImage from "@/assets/nilanjan2.jpeg";
import arnabGuhaImage from "@/assets/ArnabGuho.jpg";
import debaPrasadImage from "@/assets/DebaPrasad.jpg";
import sabreenaBeggImage from "@/assets/Sabreena.jpg";
import chitradeepSinhaImage from "@/assets/Chitradeep.jpg";

const governingBody = [
  {
    name: "Adip Nath Roy",
    title: "President",
    department: "Electrical",
    year: "1969",
    linkedin: "https://www.linkedin.com/in/adip-roy-25b8453/",
    image: adipRoyImage,
  },
  {
    name: "Debashis Mitra",
    title: "Vice President",
    department: "Mechanical",
    year: "1992",
    linkedin: "https://www.linkedin.com/in/debashis-mitra-b4113869/",
    image: debashisMitraImage,
  },
  {
    name: "Nilanjan Sasmal",
    title: "Secretary",
    department: "Mechanical",
    year: "1998",
    linkedin: "https://www.linkedin.com/in/nilanjansasmal/",
    image: nilanjanSasmalImage,
  },
  {
    name: "Arnab Guha",
    title: "Treasurer",
    department: "Mechanical",
    year: "2000",
    linkedin: "https://www.linkedin.com/in/arnab-guha-3135668/",
    image: arnabGuhaImage,
  },
  {
    name: "Deba Prasad Das",
    title: "GB Member",
    department: "Mechanical",
    year: "1995",
    linkedin: "https://www.linkedin.com/in/deba-prasad-das-3489244/",
    image: debaPrasadImage,
  },
  {
    name: "Sabreena Begg",
    title: "GB Member",
    department: "CSE",
    year: "2013",
    linkedin: "https://www.linkedin.com/in/sabreena-begg-07a524115/",
    image: sabreenaBeggImage,
  },
  {
    name: "Chitradeep Sinha",
    title: "GB Member",
    department: "Electrical",
    year: "2023",
    linkedin: "https://www.linkedin.com/in/chitradeepsinha/",
    image: chitradeepSinhaImage,
  },
];

const roadmap = [
  {
    year: "2026",
    title: "Foundation & Setup",
    icon: Building2,
    color: "bg-[#1a365d]",
    description: "Establish legal, operational, and digital frameworks required for sustainable growth.",
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
    year: "2027",
    title: "Program Activation",
    icon: Handshake,
    color: "bg-[#6b7c3f]",
    description: "Create engagement with college and build partnerships with industry.",
    items: [
      "Implementing mentorship programs",
      "Hosting networking events",
      "Creating internship and scholarship opportunities",
      "Building collaborations with industry partners to support students and alumni",
    ],
  },
  {
    year: "2028",
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
      <section className="section-padding pb-4 md:pb-6 bg-background">
        <div className="container-custom">
          <div className="bg-card rounded-2xl p-8 md:p-12 card-shadow text-center max-w-4xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 mx-auto">
              <Target className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-card-foreground mb-4">
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To foster a strong and engaged community of Jalpaiguri Government Engineering College Alumni Association in Pune
              and other places by promoting meaningful connections, nurturing lifelong 
              relationships, encouraging collaboration, and contributing to our alma mater 
              and the wider community.
            </p>
          </div>
        </div>
      </section>

      {/* Three Year Roadmap */}
      <section className="py-10 md:py-14 px-4 md:px-8 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
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
                    <span className="text-lg font-bold text-foreground">{phase.year.split(" ")[0]}</span>
                  </div>
                  <span className="text-white text-sm font-medium">{phase.year.split(" ")[1]}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <phase.icon className="w-6 h-6 text-accent" />
                    <h3 className="text-lg font-serif font-bold text-card-foreground">
                      {phase.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{phase.description}</p>
                  <ul className="space-y-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
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

      {/* Governing Body */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Governing Body
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {governingBody.map((member) => (
              <div
                key={member.name}
                className="bg-card rounded-2xl p-6 card-shadow hover:elevated-shadow transition-all duration-300 text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-accent/20 relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-serif font-bold text-card-foreground">
                  {member.name}
                </h3>
                <p className="text-accent font-medium text-sm">{member.title}</p>
                <p className="text-muted-foreground text-sm">
                  {member.department} | Batch of {member.year}
                </p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name}'s LinkedIn profile`}
                  className="inline-flex items-center justify-center mt-4 text-muted-foreground hover:text-accent transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
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
                As a member of the JALPAIGURI ENGINEERS ASSOCIATION Pune Chapter, you gain access to 
                a wealth of resources, connections, and opportunities designed to support 
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
                    <span className="text-primary-foreground/90">{benefit}</span>
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
            Join hundreds of fellow alumni who have already made the Jalpaiguri Engineers 
            Association Pune Chapter their home away from home.
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

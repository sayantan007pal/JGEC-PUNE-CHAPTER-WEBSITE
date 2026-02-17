import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Heart, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const benefits = [
  {
    id: 1,
    name: "Networking Opportunities",
    category: "Professional",
    icon: Users,
    description: "Connect with fellow alumni, expand your professional network, and find mentors within the community.",
    details: "Access our exclusive directory of alumni across various industries and globe."
  },
  {
    id: 2,
    name: "Career Support",
    category: "Growth",
    icon: Briefcase,
    description: "Access job postings, career guidance, and skill development workshops exclusive to members.",
    details: "Regular webinars and workshops on emerging technologies and soft skills."
  },
  {
    id: 3,
    name: "Mentorship Program",
    category: "Education",
    icon: GraduationCap,
    description: "Give back by mentoring students or get guidance from experienced alumni.",
    details: " Structured mentorship programs connecting students with industry veterans."
  },
  {
    id: 4,
    name: "Community Events",
    category: "Social",
    icon: Heart,
    description: "Participate in regular meetups, annual gatherings, and fun social activities.",
    details: "From official reunions to casual coffee meetups in your city."
  }
];

export default function BenefitsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner.src})` }}
        />
        <div className="absolute inset-0 overlay-gradient" />
        
        <div className="relative z-10 container-custom px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
            Membership Benefits
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Discover the value of being part of our vibrant alumni community
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-padding bg-background">
        <div className="container-custom text-center mb-16">
          <span className="text-accent font-medium text-sm uppercase tracking-wider">
            Why Join Us?
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">
            Unlock Exclusive Advantages
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Joining the JGEC Alumni Association Pune Chapter opens doors to a world of opportunities, 
            friendships, and professional growth. We are committed to supporting our members 
            in every stage of their personal and professional journey.
          </p>
        </div>

        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={benefit.id}
                  className="bg-card rounded-xl p-8 card-shadow hover:elevated-shadow transition-all duration-300 border border-border/50 group"
                >
                  <div className="flex items-start gap-6">
                    <div className="bg-primary/5 p-4 rounded-lg group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                        {benefit.name}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {benefit.description}
                      </p>
                      <p className="text-sm text-accent font-medium">
                        {benefit.details}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-accent/10">
        <div className="container-custom">
          <div className="bg-primary rounded-2xl overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 items-center">
              <div className="p-8 md:p-12 lg:col-span-2 text-primary-foreground">
                <h2 className="text-3xl font-serif font-bold mb-4">
                  Ready to Experience These Benefits?
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-8">
                  Join the Pune Chapter today and start connecting with your alma mater and fellow graduates.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button variant="hero" size="lg">
                      Become a Member
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                   <Link href="/events">
                    <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" size="lg">
                      Explore Events
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block h-full min-h-[300px] relative bg-secondary/20">
                 {/* Decorative element or pattern could go here */}
                 <div className="absolute inset-0 flex items-center justify-center p-8 text-primary-foreground/10">
                    <Users className="w-32 h-32" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

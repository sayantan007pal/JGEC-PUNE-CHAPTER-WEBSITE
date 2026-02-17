import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Eye, Heart, Users, Award, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const values = [
  {
    icon: Heart,
    title: "Brotherhood",
    description: "Fostering lifelong bonds among alumni regardless of batch or branch.",
  },
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

const About = () => {
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
            About Us
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Connecting generations of engineers, building bridges of opportunity
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card rounded-2xl p-8 card-shadow">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To unite alumni of Jalpaiguri Government Engineering College residing in Pune 
                and surrounding areas, fostering a spirit of camaraderie and mutual support. 
                We strive to create meaningful connections that transcend professional boundaries 
                and contribute to the growth of both our members and our alma mater.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 card-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the most vibrant and impactful regional alumni chapter, recognized for 
                our commitment to professional excellence, community service, and the continuous 
                development of our members. We envision a network where every alumnus finds 
                opportunities for growth and meaningful contribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-8">
              A Legacy of Excellence
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-6 text-left">
              <p>
                Jalpaiguri Government Engineering College (JGEC), established in 1961, has been 
                a premier institution of engineering education in Eastern India. Over six decades, 
                it has produced thousands of engineers who have made significant contributions 
                across industries worldwide.
              </p>
              <p>
                The JGEC Alumni Association Pune Chapter was founded in 2005 by a group of 
                passionate alumni who wanted to maintain their connection to their alma mater 
                while building a supportive community in Pune. What started as informal 
                gatherings has grown into a well-organized association with over 500 active members.
              </p>
              <p>
                Today, our chapter organizes regular events, mentorship programs, and 
                networking sessions. We actively contribute to JGEC's development through 
                scholarships, infrastructure support, and industry connections for current students.
              </p>
            </div>
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
                <p className="text-muted-foreground text-sm">{value.description}</p>
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
                As a member of the JGEC Alumni Association Pune Chapter, you gain access to 
                a wealth of resources, connections, and opportunities designed to support 
                your professional and personal growth.
              </p>
              <Link to="/contact">
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
            Join hundreds of fellow alumni who have already made the JGEC Alumni 
            Association Pune Chapter their home away from home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="default" size="xl">
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" size="xl">
                View Upcoming Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

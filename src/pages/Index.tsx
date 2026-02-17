import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Award, MapPin, ArrowRight, Star } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import alumni1 from "@/assets/alumni-1.jpg";
import alumni2 from "@/assets/alumni-2.jpg";
import alumni3 from "@/assets/alumni-3.jpg";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";

const stats = [
  { number: "5000+", label: "Alumni Members", icon: Users },
  { number: "25+", label: "Regional Chapters", icon: MapPin },
  { number: "100+", label: "Annual Events", icon: Calendar },
  { number: "50+", label: "Years of Legacy", icon: Award },
];

const achievements = [
  {
    name: "Rajesh Kumar",
    role: "CEO, Tech Innovations Pvt Ltd",
    batch: "1995",
    image: alumni1,
    quote: "JGEC gave me the foundation to build my dreams. The alumni network has been invaluable.",
  },
  {
    name: "Dr. Priya Sharma",
    role: "Director, Engineering Research Institute",
    batch: "2002",
    image: alumni2,
    quote: "The values instilled at JGEC continue to guide my professional journey.",
  },
  {
    name: "Amit Patel",
    role: "Founder, StartupHub",
    batch: "2010",
    image: alumni3,
    quote: "The entrepreneurial spirit I developed at JGEC helped me take the leap of faith.",
  },
];

const upcomingEvents = [
  {
    title: "Annual Alumni Reunion 2026",
    date: "March 15, 2026",
    location: "Pune Convention Center",
    image: event1,
    description: "Join us for the biggest gathering of JGEC alumni this year.",
  },
  {
    title: "Career Mentorship Program",
    date: "February 28, 2026",
    location: "Virtual Event",
    image: event2,
    description: "Connect with industry leaders and advance your career.",
  },
];

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="absolute inset-0 overlay-gradient" />
        
        <div className="relative z-10 container-custom px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                Established 1961 • 50+ Years of Excellence
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground mb-6 leading-tight">
              JGEC Alumni Association
              <span className="block text-accent">Pune Chapter</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connecting graduates of Jalpaiguri Government Engineering College. 
              Building bridges, creating opportunities, and celebrating our shared legacy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about">
                <Button variant="hero" size="xl">
                  Join Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="heroOutline" size="xl">
                  Alumni Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-accent rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16">
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
      </section>

      {/* About Preview */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">
                A Legacy of Excellence and Brotherhood
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The JGEC Alumni Association Pune Chapter brings together graduates from 
                Jalpaiguri Government Engineering College who have made Pune their home. 
                We are dedicated to fostering connections, supporting current students, 
                and celebrating the achievements of our members.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our mission is to create a vibrant community that nurtures professional 
                growth, provides networking opportunities, and gives back to our alma mater.
              </p>
              <Link to="/about">
                <Button variant="default" size="lg">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden card-shadow">
                  <img src={event1} alt="Alumni event" className="w-full h-48 object-cover" />
                </div>
                <div className="bg-accent rounded-2xl p-6 text-center">
                  <div className="text-3xl font-serif font-bold text-accent-foreground">50+</div>
                  <div className="text-accent-foreground/80 text-sm">Years of Legacy</div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-primary rounded-2xl p-6 text-center">
                  <div className="text-3xl font-serif font-bold text-primary-foreground">5000+</div>
                  <div className="text-primary-foreground/80 text-sm">Active Members</div>
                </div>
                <div className="rounded-2xl overflow-hidden card-shadow">
                  <img src={event2} alt="Graduation ceremony" className="w-full h-48 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              What's Happening
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Upcoming Events
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="bg-card rounded-2xl overflow-hidden card-shadow hover:elevated-shadow transition-shadow duration-300"
              >
                <div className="relative h-56">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                    {event.date}
                  </div>
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
                  <Link to="/events">
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
            <Link to="/events">
              <Button variant="default" size="lg">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Our Distinguished Alumni
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((alumni) => (
              <div
                key={alumni.name}
                className="bg-card rounded-2xl p-6 card-shadow hover:elevated-shadow transition-all duration-300 text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-accent/20">
                  <img
                    src={alumni.image}
                    alt={alumni.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-serif font-bold text-card-foreground">
                  {alumni.name}
                </h3>
                <p className="text-accent font-medium text-sm">{alumni.role}</p>
                <p className="text-muted-foreground text-sm mb-4">Batch of {alumni.batch}</p>
                <p className="text-muted-foreground text-sm italic">"{alumni.quote}"</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/achievements">
              <Button variant="default" size="lg">
                View All Achievements
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="absolute inset-0 overlay-gradient" />
        
        <div className="relative z-10 container-custom px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Become a part of the JGEC Alumni Association and stay connected with 
            your batchmates, access exclusive events, and contribute to our alma mater.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about">
              <Button variant="hero" size="xl">
                Become a Member
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="heroOutline" size="xl">
                Support Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

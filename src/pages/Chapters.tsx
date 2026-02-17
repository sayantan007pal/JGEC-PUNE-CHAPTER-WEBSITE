import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Phone, Mail, Globe, ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const chapters = [
  {
    id: 1,
    name: "Pune Chapter",
    location: "Pune, Maharashtra",
    members: 500,
    established: 2005,
    coordinator: "Mr. Suresh Patil",
    email: "pune@jgecalumni.org",
    phone: "+91 98765 43210",
    description: "The Pune chapter is one of the most active chapters with regular monthly meetups and annual events.",
    isMain: true,
  },
  {
    id: 2,
    name: "Bangalore Chapter",
    location: "Bangalore, Karnataka",
    members: 350,
    established: 2008,
    coordinator: "Ms. Lakshmi Reddy",
    email: "bangalore@jgecalumni.org",
    phone: "+91 98765 43211",
    description: "Our tech hub chapter, connecting alumni working in India's Silicon Valley.",
  },
  {
    id: 3,
    name: "Mumbai Chapter",
    location: "Mumbai, Maharashtra",
    members: 280,
    established: 2007,
    coordinator: "Mr. Rahul Sharma",
    email: "mumbai@jgecalumni.org",
    phone: "+91 98765 43212",
    description: "The financial capital chapter bringing together alumni in banking, finance, and corporate sectors.",
  },
  {
    id: 4,
    name: "Delhi NCR Chapter",
    location: "Delhi, NCR",
    members: 220,
    established: 2010,
    coordinator: "Dr. Anil Gupta",
    email: "delhi@jgecalumni.org",
    phone: "+91 98765 43213",
    description: "Connecting alumni in the national capital region across government and private sectors.",
  },
  {
    id: 5,
    name: "Kolkata Chapter",
    location: "Kolkata, West Bengal",
    members: 450,
    established: 2003,
    coordinator: "Mr. Dipak Banerjee",
    email: "kolkata@jgecalumni.org",
    phone: "+91 98765 43214",
    description: "Our home state chapter, maintaining strong ties with the college and local industries.",
  },
  {
    id: 6,
    name: "Hyderabad Chapter",
    location: "Hyderabad, Telangana",
    members: 180,
    established: 2012,
    coordinator: "Mr. Krishna Rao",
    email: "hyderabad@jgecalumni.org",
    phone: "+91 98765 43215",
    description: "Growing chapter in the emerging tech hub of South India.",
  },
  {
    id: 7,
    name: "Chennai Chapter",
    location: "Chennai, Tamil Nadu",
    members: 150,
    established: 2011,
    coordinator: "Ms. Priya Venkatesh",
    email: "chennai@jgecalumni.org",
    phone: "+91 98765 43216",
    description: "Connecting alumni in the automotive and manufacturing hub of India.",
  },
  {
    id: 8,
    name: "USA Chapter",
    location: "United States",
    members: 120,
    established: 2015,
    coordinator: "Dr. Amit Roy",
    email: "usa@jgecalumni.org",
    phone: "+1 408 555 0123",
    description: "International chapter connecting alumni across North America.",
    isInternational: true,
  },
];

const Chapters = () => {
  const mainChapter = chapters.find(c => c.isMain);
  const otherChapters = chapters.filter(c => !c.isMain);

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
            Regional Chapters
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Our alumni network spans across India and the globe
          </p>
        </div>
      </section>

      {/* Main Chapter Highlight */}
      {mainChapter && (
        <section className="section-padding bg-accent/10">
          <div className="container-custom">
            <div className="bg-card rounded-2xl overflow-hidden card-shadow">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="bg-primary p-8 md:p-12 text-primary-foreground">
                  <span className="inline-block px-4 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium mb-6">
                    Featured Chapter
                  </span>
                  <h2 className="text-3xl font-serif font-bold mb-4">{mainChapter.name}</h2>
                  <p className="text-primary-foreground/80 mb-6">{mainChapter.description}</p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <div className="text-3xl font-serif font-bold text-accent">{mainChapter.members}+</div>
                      <div className="text-primary-foreground/70 text-sm">Active Members</div>
                    </div>
                    <div>
                      <div className="text-3xl font-serif font-bold text-accent">{mainChapter.established}</div>
                      <div className="text-primary-foreground/70 text-sm">Established</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-accent" />
                      <span>Coordinator: {mainChapter.coordinator}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-accent" />
                      <a href={`mailto:${mainChapter.email}`} className="hover:text-accent transition-colors">
                        {mainChapter.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-accent" />
                      <a href={`tel:${mainChapter.phone}`} className="hover:text-accent transition-colors">
                        {mainChapter.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex items-center justify-center bg-secondary">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                      {mainChapter.location}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Join our vibrant community of JGEC alumni in Pune
                    </p>
                    <Link to="/contact">
                      <Button variant="default" size="lg">
                        Connect With Us
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Chapters */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Our Network
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              All Regional Chapters
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherChapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-card rounded-xl p-6 card-shadow hover:elevated-shadow transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-card-foreground">
                      {chapter.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4" />
                      {chapter.location}
                    </div>
                  </div>
                  {chapter.isInternational && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium">
                      <Globe className="w-3 h-3" />
                      International
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground text-sm mb-4">{chapter.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">{chapter.members} members</span>
                  </div>
                  <div className="text-muted-foreground">Est. {chapter.established}</div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-card-foreground">Coordinator:</span> {chapter.coordinator}
                  </div>
                  <a
                    href={`mailto:${chapter.email}`}
                    className="text-sm text-accent hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" />
                    {chapter.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Start a Chapter CTA */}
      <section className="section-padding bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">
            Start a Chapter in Your City
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Don't see a chapter in your city? Take the initiative to connect 
            with fellow JGEC alumni and start a new regional chapter.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Chapters;

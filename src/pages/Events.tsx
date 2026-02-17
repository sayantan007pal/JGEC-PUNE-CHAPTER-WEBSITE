import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, ArrowRight, Filter } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";

const events = [
  {
    id: 1,
    title: "Annual Alumni Reunion 2026",
    date: "March 15, 2026",
    time: "6:00 PM onwards",
    location: "Pune Convention Center",
    image: event1,
    description: "Join us for the biggest gathering of JGEC alumni this year. Network with fellow alumni, enjoy cultural programs, and relive your college memories.",
    category: "Reunion",
    attendees: 250,
    featured: true,
  },
  {
    id: 2,
    title: "Career Mentorship Program",
    date: "February 28, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Virtual Event",
    image: event2,
    description: "Connect with industry leaders and senior alumni who will share their career experiences and provide guidance for your professional growth.",
    category: "Mentorship",
    attendees: 100,
    featured: true,
  },
  {
    id: 3,
    title: "Technical Workshop: AI/ML",
    date: "April 10, 2026",
    time: "2:00 PM - 6:00 PM",
    location: "Tech Park, Hinjewadi",
    image: event1,
    description: "Hands-on workshop on the latest trends in Artificial Intelligence and Machine Learning, conducted by industry experts.",
    category: "Workshop",
    attendees: 50,
    featured: false,
  },
  {
    id: 4,
    title: "Sports Day",
    date: "May 5, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "Balewadi Stadium",
    image: event2,
    description: "A day of sports activities including cricket, badminton, and table tennis. Bring your families for a fun-filled day.",
    category: "Sports",
    attendees: 150,
    featured: false,
  },
  {
    id: 5,
    title: "Networking Dinner",
    date: "June 20, 2026",
    time: "7:00 PM onwards",
    location: "JW Marriott, Pune",
    image: event1,
    description: "An elegant evening of networking and fine dining with fellow alumni. Great opportunity to expand your professional network.",
    category: "Networking",
    attendees: 80,
    featured: false,
  },
  {
    id: 6,
    title: "Family Picnic",
    date: "July 15, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "Lavasa",
    image: event2,
    description: "A fun day out with families. Games, food, and entertainment for all ages. Kids' special activities included.",
    category: "Social",
    attendees: 200,
    featured: false,
  },
];

const categories = ["All", "Reunion", "Mentorship", "Workshop", "Sports", "Networking", "Social"];

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const featuredEvents = events.filter(event => event.featured);

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
              Don't Miss Out
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Featured Events
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-card rounded-2xl overflow-hidden card-shadow hover:elevated-shadow transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                    Featured
                  </div>
                  <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm">
                    {event.category}
                  </div>
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
                      <Clock className="w-4 h-4 text-accent" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 text-accent" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Users className="w-4 h-4 text-accent" />
                      {event.attendees} expected attendees
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <Button variant="default" size="lg" className="w-full">
                    Register Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
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
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs">
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
};

export default Events;

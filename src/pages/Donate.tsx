import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, GraduationCap, Building2, Lightbulb, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const donationAreas = [
  {
    icon: GraduationCap,
    title: "Student Scholarships",
    description: "Support deserving students with financial aid for their education and living expenses.",
  },
  {
    icon: Building2,
    title: "Infrastructure Development",
    description: "Help improve college facilities, laboratories, and learning spaces.",
  },
  {
    icon: Lightbulb,
    title: "Innovation Fund",
    description: "Support student projects, startups, and innovation initiatives.",
  },
  {
    icon: Users,
    title: "Alumni Activities",
    description: "Fund chapter events, networking programs, and community initiatives.",
  },
];

const impactNumbers = [
  { value: "₹50L+", label: "Raised to Date" },
  { value: "200+", label: "Students Supported" },
  { value: "15+", label: "Projects Funded" },
  { value: "5", label: "Labs Upgraded" },
];

const Donate = () => {
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
            Support Our Alma Mater
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Your contribution makes a difference in the lives of current and future JGECians
          </p>
        </div>
      </section>

      {/* Why Donate */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                Make an Impact
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">
                Why Your Support Matters
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                As alumni, we have a unique opportunity to give back to the institution 
                that shaped our careers and lives. Your contributions directly impact 
                current students, faculty, and the overall development of JGEC.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether it's funding scholarships for underprivileged students, upgrading 
                laboratory equipment, or supporting innovative student projects, every 
                rupee you donate creates lasting change.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {impactNumbers.map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-secondary rounded-xl">
                    <div className="text-2xl font-serif font-bold text-accent">{stat.value}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 card-shadow">
              <Heart className="w-12 h-12 text-accent mb-6" />
              <h3 className="text-2xl font-serif font-bold text-card-foreground mb-4">
                Make a Donation
              </h3>
              <p className="text-muted-foreground mb-6">
                Choose your donation amount and make a difference today.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {["₹1,000", "₹5,000", "₹10,000"].map((amount) => (
                  <button
                    key={amount}
                    className="py-3 px-4 border-2 border-accent/30 rounded-lg text-foreground font-medium hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                  >
                    {amount}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <Button variant="default" size="lg" className="w-full">
                Donate Now
                <Heart className="w-4 h-4" />
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Donations are tax-deductible under Section 80G
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Areas */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Where Your Money Goes
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Areas of Support
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationAreas.map((area) => (
              <div
                key={area.title}
                className="bg-card rounded-xl p-6 card-shadow text-center hover:elevated-shadow transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <area.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-serif font-bold text-card-foreground mb-2">
                  {area.title}
                </h3>
                <p className="text-muted-foreground text-sm">{area.description}</p>
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
                Donor Benefits
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mt-3 mb-6">
                Recognition for Your Generosity
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-8">
                We appreciate every contribution and recognize our donors through 
                various programs and initiatives.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-8">
              <ul className="space-y-4">
                {[
                  "Tax benefits under Section 80G",
                  "Recognition on donor wall at college",
                  "Invitation to exclusive donor events",
                  "Certificate of appreciation",
                  "Regular updates on fund utilization",
                  "Naming opportunities for major donors",
                  "Priority access to alumni events",
                  "Feature in alumni newsletter",
                ].map((benefit) => (
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

      {/* Other Ways to Help */}
      <section className="section-padding bg-background">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Other Ways to Contribute
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Can't donate money? There are other meaningful ways to support our community.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Mentor Students",
                description: "Guide current students in their career paths",
              },
              {
                title: "Offer Internships",
                description: "Provide opportunities at your organization",
              },
              {
                title: "Share Expertise",
                description: "Conduct workshops and training sessions",
              },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl p-6 card-shadow">
                <h3 className="font-serif font-bold text-card-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link to="/contact">
              <Button variant="default" size="lg">
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;

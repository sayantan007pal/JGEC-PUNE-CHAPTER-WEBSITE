import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Briefcase, GraduationCap, ArrowRight, Quote } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import alumni1 from "@/assets/alumni-1.jpg";
import alumni2 from "@/assets/alumni-2.jpg";
import alumni3 from "@/assets/alumni-3.jpg";

const alumniProfiles = [
  {
    id: 1,
    name: "Rajesh Kumar",
    designation: "CEO & Founder",
    company: "Tech Innovations Pvt Ltd",
    batch: "1995",
    branch: "Computer Science",
    image: alumni1,
    bio: "Rajesh founded Tech Innovations in 2005 and has grown it into a multinational company with over 5000 employees. His journey from a small-town boy to a tech mogul is an inspiration to many.",
    achievements: [
      "Forbes 40 Under 40 (2015)",
      "Entrepreneur of the Year - CII (2018)",
      "Patent holder - 15+ technology patents"
    ],
    quote: "JGEC taught me that with determination and hard work, any dream is achievable. The foundation laid here has been instrumental in my success."
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    designation: "Director",
    company: "Engineering Research Institute",
    batch: "2002",
    branch: "Electrical Engineering",
    image: alumni2,
    bio: "Dr. Priya is a renowned researcher in renewable energy systems. She has published over 50 research papers and holds 8 patents in solar energy technology.",
    achievements: [
      "National Science Award (2020)",
      "Women in STEM Leadership Award (2019)",
      "UNESCO Recognition for Clean Energy Research"
    ],
    quote: "The rigorous academic environment at JGEC prepared me for the challenges of research. I'm proud to be an alumna."
  },
  {
    id: 3,
    name: "Amit Patel",
    designation: "Founder & CTO",
    company: "StartupHub Ventures",
    batch: "2010",
    branch: "Information Technology",
    image: alumni3,
    bio: "Amit is a serial entrepreneur who has founded three successful startups. His current venture, StartupHub, has helped launch over 200 startups across India.",
    achievements: [
      "Top 30 Under 30 - Business Today (2018)",
      "Best Startup Mentor Award (2021)",
      "Raised $50M in venture funding"
    ],
    quote: "The entrepreneurial spirit I developed during my time at JGEC gave me the courage to take risks and innovate."
  },
  {
    id: 4,
    name: "Sunita Devi",
    designation: "Vice President",
    company: "Global Tech Solutions",
    batch: "1998",
    branch: "Mechanical Engineering",
    image: alumni2,
    bio: "Sunita broke barriers in the male-dominated manufacturing industry to become one of the youngest VPs at Global Tech Solutions.",
    achievements: [
      "Women in Manufacturing Award (2017)",
      "Industry Excellence Award - FICCI (2019)",
      "Mentored 100+ women engineers"
    ],
    quote: "JGEC gave me the confidence to compete in a challenging industry. The college shaped my character and determination."
  },
  {
    id: 5,
    name: "Dr. Vikram Singh",
    designation: "Chief Medical Officer",
    company: "MedTech Innovations",
    batch: "2000",
    branch: "Electronics Engineering",
    image: alumni1,
    bio: "Dr. Vikram transitioned from electronics to healthcare technology, revolutionizing medical devices in India.",
    achievements: [
      "Healthcare Innovation Award (2020)",
      "Patent holder - Medical devices",
      "TED Speaker on HealthTech"
    ],
    quote: "The multidisciplinary approach at JGEC helped me see connections between engineering and healthcare that others missed."
  },
  {
    id: 6,
    name: "Ananya Roy",
    designation: "Senior Director",
    company: "Amazon Web Services",
    batch: "2008",
    branch: "Computer Science",
    image: alumni2,
    bio: "Ananya leads cloud infrastructure teams at AWS, managing products used by millions of customers worldwide.",
    achievements: [
      "AWS Leadership Award (2022)",
      "Women in Cloud Computing (2021)",
      "Speaker at re:Invent 2023"
    ],
    quote: "The problem-solving skills I learned at JGEC are something I use every day at one of the world's biggest tech companies."
  },
];

const Achievements = () => {
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
            Achievements & Success Stories
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Celebrating the remarkable accomplishments of our distinguished alumni
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-background">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <Award className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
            Pride of JGEC
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Our alumni have made significant contributions across industries, from technology 
            and healthcare to manufacturing and entrepreneurship. Their achievements reflect 
            the excellent education and values instilled at Jalpaiguri Government Engineering 
            College. Here are some of their inspiring stories.
          </p>
        </div>
      </section>

      {/* Alumni Profiles */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="space-y-12">
            {alumniProfiles.map((alumni, index) => (
              <div
                key={alumni.id}
                className={`bg-card rounded-2xl overflow-hidden card-shadow ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                <div className="grid md:grid-cols-3 gap-0">
                  <div className={`relative h-64 md:h-auto ${index % 2 === 1 ? "md:order-2" : ""}`}>
                    <img
                      src={alumni.image}
                      alt={alumni.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent md:hidden" />
                    <div className="absolute bottom-4 left-4 md:hidden">
                      <h3 className="text-xl font-serif font-bold text-white">{alumni.name}</h3>
                      <p className="text-white/80 text-sm">{alumni.designation}</p>
                    </div>
                  </div>
                  <div className={`p-8 md:col-span-2 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                    <div className="hidden md:block mb-4">
                      <h3 className="text-2xl font-serif font-bold text-card-foreground">{alumni.name}</h3>
                      <p className="text-accent font-medium">{alumni.designation}, {alumni.company}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        <GraduationCap className="w-4 h-4" />
                        Batch of {alumni.batch}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        <Briefcase className="w-4 h-4" />
                        {alumni.branch}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4">{alumni.bio}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-card-foreground mb-2">Key Achievements:</h4>
                      <ul className="space-y-1">
                        {alumni.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                            <Award className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-secondary/50 rounded-xl p-4 border-l-4 border-accent">
                      <Quote className="w-6 h-6 text-accent mb-2" />
                      <p className="text-muted-foreground italic">{alumni.quote}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Story CTA */}
      <section className="section-padding bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">
            Share Your Success Story
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Are you a JGEC alumnus with an inspiring story? We'd love to feature your 
            achievements and inspire the next generation of engineers.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl">
              Submit Your Story
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Achievements;

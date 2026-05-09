import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Award, Briefcase, GraduationCap, ArrowRight, Quote } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import alumni1 from "@/assets/Adip-da.jpg";
import alumni2 from "@/assets/Pradeep-da.jpg";
import alumni3 from "@/assets/Pushpal-da.jpg";

const alumniProfiles = [
  {
    id: 1,
    name: "Shri Adip Roy",
    designation: "Faculty & Executive Coach",
    company: "Management Institutes, Pune",
    batch: "1980",
    branch: "Electrical Engineering",
    image: alumni1,
    bio: "Shri Adip Nath Roy is a seasoned leader whose career spans over 35 years at the intersection of technology, business, and people development. He has held senior leadership roles at some of the most respected names in India's IT services industry — IBM, Fujitsu ICIM, PCS Technology, and PCL — building and scaling large, complex service organizations from the ground up. At IBM, he led an 800-member service division with revenues of $25 million, earning the prestigious IBM \"Person of the Year\" award in recognition of his extraordinary impact. His ability to inspire teams, navigate organizational complexity, and deliver results made him one of the most sought-after leaders in the industry. After three decades in the corporate world, Shri Roy chose a path of giving back. Transitioning into academia and executive coaching, he joined the faculty of leading management institutes in Pune, where he has since mentored over 150 senior executives from across India. His sessions are known for their rare combination of real-world insight and structured thinking. A graduate in Electrical Engineering with an MBA, his journey from JGEC to the boardroom — and ultimately to the classroom — is a testament to the enduring value of a strong technical foundation paired with lifelong curiosity.",
    achievements: [
      "IBM \"Person of the Year\" Award",
      "Built and led an 800-member, $25 million service division at IBM",
      "35+ year career across IBM, Fujitsu ICIM, PCS Technology, and PCL",
      "Mentored 150+ senior executives across India as a faculty member in Pune"
    ],
    quote: "Leadership is not about titles. It's about impact — and every experience, from the IBM boardroom to the classroom, has only deepened that conviction."
  },
  {
    id: 2,
    name: "Cdr. Pradeep Bandyopadhyay",
    designation: "Director of Capital Projects",
    company: "American Energy Company (Retd.)",
    batch: "1978",
    branch: "Mechanical Engineering",
    image: alumni2,
    bio: "Commander Pradeep Bandyopadhyay's career is a remarkable story of reinvention across continents, industries, and disciplines. A Mechanical Engineer by training and an officer of the Indian Navy, he served from 1980 to 2002 in a wide range of demanding roles — from warship operations and maintenance to engineering training and the oversight of naval construction projects. He also represented India as part of the diplomatic mission at the Indian Embassy in Moscow, bringing an international dimension to an already diverse career. His naval service was distinguished by technical rigor, adaptability, and an unwavering commitment to operational excellence. Following his retirement from the Navy in 2002, Commander Bandyopadhyay made a bold transition to Canada, where he entered the natural gas processing industry. He quickly rose through the ranks, first serving as Principal Mechanical Engineer and later as Director of Capital Projects at a leading American energy company — a role that placed him at the helm of major infrastructure investments. He retired from this position in 2023 after more than two decades of service. Holding advanced qualifications in Defence & Strategic Studies and Marine Engineering, his life is a compelling example of how technical mastery, discipline, and intellectual curiosity can chart a course that transcends borders.",
    achievements: [
      "Served in the Indian Navy from 1980 to 2002 across operations, maintenance, and training",
      "Diplomatic service at the Indian Embassy, Moscow",
      "Principal Mechanical Engineer in Canada's natural gas processing industry",
      "Director of Capital Projects at a leading American energy company (Retd. 2023)"
    ],
    quote: "A career that crossed oceans and industries was made possible by one thing: the engineering discipline and rigour that began at JGEC."
  },
  {
    id: 3,
    name: "Brig. Pushpal De, Retd.",
    designation: "Chief Engineer | Brigadier (Retd.)",
    company: "Indian Army",
    batch: "1965",
    branch: "Civil Engineering",
    image: alumni3,
    bio: "Brigadier Pushpal De's life is one of extraordinary service — to the nation, to the profession of engineering, and to the community. A distinguished alumnus of JGEC, he was commissioned into the Indian Army's Corps of Engineers in 1969 and went on to serve the nation for over 36 years, not just in the Army but also in the Indian Navy and Air Force, making him one of the rare officers to have served across all three defence services. His operational record is equally impressive. He played active roles in the 1971 Liberation War and the Kargil Operation of 1999 — two of India's most defining military chapters — demonstrating both courage in the field and engineering acumen under pressure. In the latter stages of his career, he served as Chief Engineer of the Southern Naval Command and the Southern Army Command, overseeing large-scale infrastructure projects of national strategic importance. Among the most notable of these were the Naval Academy at Ezhimala — a landmark institution — and the Command Hospital Complex in Pune. His academic credentials are equally formidable: an M.Tech from IIT Delhi and an MBA from PUMBA, Pune. After retiring from active military service, Brigadier De channelled his expertise into Pune's real estate sector, successfully completing around 40 projects, and also served as Dean of VKIT, shaping the next generation of engineers. His journey reflects a rare synthesis of military honour, engineering excellence, and civic contribution.",
    achievements: [
      "Commissioned into the Corps of Engineers, Indian Army, in 1969; served 36+ years across Army, Navy, and Air Force",
      "Active participant in the 1971 Liberation War and the Kargil Operation (1999)",
      "Chief Engineer, Southern Naval Command and Southern Army Command",
      "Led construction of the Naval Academy, Ezhimala and Command Hospital Complex, Pune",
      "M.Tech — IIT Delhi | MBA — PUMBA | Dean, VKIT",
      "Completed ~40 real estate projects in Pune post-retirement"
    ],
    quote: "The nation asked, and I served. JGEC gave me the foundation to answer that call with engineering excellence and unflinching dedication."
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

export default function AchievementsPage() {
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
                    <Image
                      src={alumni.image}
                      alt={alumni.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent md:hidden" />
                    <div className="absolute bottom-4 left-4 md:hidden z-10">
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
          <Link href="/contact">
            <Button variant="hero" size="xl">
              Submit Your Story
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

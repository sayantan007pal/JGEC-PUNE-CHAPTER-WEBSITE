import heroBanner from "@/assets/hero-banner.jpg";
import Image from "next/image";
import alumni1 from "@/assets/Adip-da.jpg";
import alumni2 from "@/assets/Pradeep-da.jpg";
import alumni3 from "@/assets/Pushpal-da.jpg";

const achievements = [
  {
    name: "Shri Adip Roy",
    role: "Faculty & Executive Coach | Former IBM Leader",
    batch: "1970",
    image: alumni1,
    quote: "Over 35 years at IBM, Fujitsu ICIM, and beyond — building teams, scaling businesses, and earning IBM's Person of the Year. Today, mentoring the next generation of leaders from Pune's top management institutes.",
  },
  {
    name: "Cdr. Pradeep Bandyopadhyay",
    role: "Director of Capital Projects | Naval Veteran",
    batch: "1978",
    image: alumni2,
    quote: "From warship operations in the Indian Navy to leading capital projects in Canada's energy sector — a journey across continents, industries, and decades, grounded in JGEC's engineering values.",
  },
  {
    name: "Brig. Pushpal De, Retd.",
    role: "Brigadier (Retd.), Indian Army | Chief Engineer",
    batch: "1965",
    image: alumni3,
    quote: "Commissioned in 1969, served across Army, Navy, and Air Force for 36+ years. Led iconic national projects including the Naval Academy at Ezhimala. His career is a living example of engineering in service of the nation.",
  },
];

export default function AlumniCornerPage() {
  return (
    <div>
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner.src})` }}
        />
        <div className="absolute inset-0 overlay-gradient" />

        <div className="relative z-10 container-custom px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
            Alumni Corner
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            cheievements and groundbreaking stories from our Alumni. A new suucess story every month
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Success Stories
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((alumni) => (
              <div
                key={alumni.name}
                className="bg-card rounded-2xl p-6 card-shadow hover:elevated-shadow transition-all duration-300 text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-accent/20 relative">
                  <Image
                    src={alumni.image}
                    alt={alumni.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-serif font-bold text-card-foreground">
                  {alumni.name}
                </h3>
                <p className="text-accent font-medium text-sm">{alumni.role}</p>
                <p className="text-muted-foreground text-sm mb-4">Batch of {alumni.batch}</p>
                <p className="text-muted-foreground text-sm italic">&quot;{alumni.quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

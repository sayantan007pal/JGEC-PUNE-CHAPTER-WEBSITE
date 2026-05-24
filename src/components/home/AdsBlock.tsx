"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import lordOfTheRingsCover from "@/assets/lord-of-the-rings.jpg";
import warAndPeaceCover from "@/assets/war-and-peace.jpg";

const featuredBooks = [
  {
    title: "LORD OF THE RINGS",
    author: "J.R.R. Tolkien",
    image: lordOfTheRingsCover,
    href: "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings",
    shortDescription:
      "An epic high-fantasy adventure through Middle-earth, centered on friendship, courage, and the struggle against absolute power.",
  },
  {
    title: "WAR AND PEACE",
    author: "Leo Tolstoy",
    image: warAndPeaceCover,
    href: "https://en.wikipedia.org/wiki/War_and_Peace",
    shortDescription:
      "A monumental historical novel that weaves family, war, and philosophy into a sweeping portrait of Russian society during the Napoleonic era.",
  },
];

export default function AdsBlock() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <section className="px-4 md:px-8 pt-12 md:pt-20 pb-16 md:pb-24 bg-muted border-y border-border/40">
      <div className="container-custom">
        <div className="flex items-start justify-between gap-4 mb-12">
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Featured Ads
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">
              Book Recommendations
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="mt-1 h-10 w-10 rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:text-foreground hover:bg-background"
            aria-label="Close book recommendations"
            title="Close"
          >
            <X className="w-5 h-5 mx-auto" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featuredBooks.map((book) => (
            <div
              key={book.title}
              className="bg-card rounded-2xl overflow-hidden card-shadow hover:elevated-shadow transition-shadow duration-300"
            >
              <div className="relative h-56">
                <Image
                  src={book.image}
                  alt={`${book.title} cover`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium z-10">
                  Classic Pick
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-card-foreground mb-1">
                  {book.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  by {book.author}
                </p>
                <p className="text-muted-foreground mb-4">
                  {book.shortDescription}
                </p>

                <Link href={book.href} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    Read About This Book
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

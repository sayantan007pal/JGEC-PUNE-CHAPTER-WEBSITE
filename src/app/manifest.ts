import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alumni Association Jalpaiguri Government Engineering College - Pune Chapter",
    short_name: "AA JGEC Pune",
    description:
      "Official community for Alumni Association Jalpaiguri Government Engineering College alumni in Pune. Connect, network, and give back.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e3a5f",
    icons: [
      {
        src: "/icon.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
      {
        src: "/apple-icon.jpg",
        sizes: "180x180",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}

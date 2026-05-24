import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JALPAIGURI ENGINEERS ASSOCIATION - Pune Chapter",
    short_name: "JEA Pune",
    description:
      "Official community for JALPAIGURI ENGINEERS ASSOCIATION alumni in Pune. Connect, network, and give back.",
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
        purpose: "apple touch icon",
      },
    ],
  };
}

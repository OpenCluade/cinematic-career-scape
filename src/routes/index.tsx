import { createFileRoute } from "@tanstack/react-router";

import { PortfolioPage } from "@/components/portfolio/PortfolioPage";

const title = "Solution Architect Portfolio — Cloud, DevOps and Backend";
const description =
  "An immersive portfolio presenting solution architecture, cloud infrastructure, DevOps automation and backend engineering work in a real-time 3D environment.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

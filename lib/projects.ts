import { Project } from '@/types/portfolio';

// Project data - parsed from project details.txt
export const projects: Project[] = [
  {
    id: 1,
    title: 'Product Aware Semantic Search Engine',
    tagline: 'A semantic search engine that transforms architectural product selection into a fast, intuitive, and evidence-based design workflow.',
    description: 'Product Aware is a prototype design decision-support system built to improve how architects and designers search, evaluate, and select building products. The tool replaces traditional keyword-based databases with a semantic search engine, allowing users to describe product needs in natural language and receive accurate, context-aware results. It features advanced filtering, structured product cards, automated colour-palette generation, and experimental 3D model previews. Designed around an architectural user persona, the system focuses on clarity, efficiency, and evidence-based decision making, demonstrating how computational methods and user-centred design can streamline material selection workflows within the AEC industry.',
    category: 'UX / Product Design',
    year: '2024',
    tools: ['Semantic search', 'Python', 'Next.js', '3D previews'],
    link: undefined,
    duration: '4 months',
    images: [
      '/data/project 1 photos/Free_Tablet_Mockup_5.png',
      '/data/project 1 photos/MacBook_Mockup_1.png',
      '/data/project 1 photos/MacBook_Mockup_2.png',
      '/data/project 1 photos/Tablet_Mockup_2.png',
    ].filter(Boolean),
  },
  {
    id: 2,
    title: 'Parametric Urban Envelope Generator',
    tagline: 'A parametric urban envelope generator that models, analyses and optimises city-scale networks through Grasshopper and an interactive web visualisation.',
    description: 'This project delivers a fully parametric building envelope system that generates, analyses and iterates urban-scale street networks, parcels, buildings and pathfinding outcomes. Built in Grasshopper using the DeCodingSpaces toolkit, the system synthesises OSM boundaries, network generation, parcel subdivision, building massing, shortest-path routing and isovisit analysis into a single optimisable pipeline. A custom UI dashboard communicates directly with the Grasshopper script through JSON, enabling users to adjust sliders, toggles and parameters while visualising outcomes in real time via a 3D model viewer and a results page featuring heatmaps, charts and spatial metrics. The tool supports performance-driven urban decision making, providing insights into network centrality, path efficiency, height distribution and park-to-GFA ratios across diverse scenarios.',
    category: 'Parametric Design',
    year: '2024',
    tools: ['Grasshopper', 'Rhino', 'DeCodingSpaces', 'JSON UI'],
    link: undefined,
    duration: '3 months',
    images: [
      '/data/project 2 photos/Macbook_Air_M2_planner.png',
      '/data/project 2 photos/Macbook_Air_M2_Results_2.png',
    ],
    imagePositions: [
      '60% center',
      '60% center',
    ],
  },
  {
    id: 3,
    title: 'Vertimoss Frog Habitat',
    tagline: 'A 3D-printed vertical moss habitat engineered to revive and protect the critically endangered Southern Corroboree Frog.',
    description: 'VertiMoss is a parametric, 3D-printable habitat system designed to restore fragile alpine ecosystems by creating a climate-resilient home for the Southern Corroboree Frog. The structure uses a customizable voronoi lattice that forms natural hollows and textured surfaces ideal for sphagnum moss growth, moisture retention and protective burrows. Printed in biodegradable wood-PLA, each module blends into the landscape, supports long-term moss propagation and provides safe breeding zones shielded from heat, predators and habitat decline. The design is scalable, low-cost and rapidly manufacturable, enabling entire moss-rich micro-ecosystems to be deployed across terrain to expand bog networks, increase biodiversity and support population recovery.',
    category: 'Fabrication / Ecology',
    year: '2023',
    tools: ['Grasshopper', '3D print', 'Wood-PLA'],
    link: undefined,
    duration: '6 weeks',
    images: [
      '/data/project 3 photos/1.png',
      '/data/project 3 photos/1p2.png',
      '/data/project 3 photos/2.png',
      '/data/project 3 photos/Moss2.png',
      '/data/project 3 photos/moss3.png',
      '/data/project 3 photos/MossMain.png',
    ],
  },
];

export function loadProjects(): Project[] {
  return projects;
}


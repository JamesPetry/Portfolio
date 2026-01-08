'use client';

import { Project } from '@/types/portfolio';
import ProjectCard from './ProjectCard';

interface PortfolioProps {
  projects: Project[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  return (
    <section className="relative w-full bg-white pt-6 md:pt-8">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </section>
  );
}


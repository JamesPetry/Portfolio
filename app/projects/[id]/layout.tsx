import { Metadata } from 'next';
import { projects } from '@/lib/projects';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const projectId = parseInt(params.id);
  const project = projects.find((p) => p.id === projectId);
  
  if (!project) {
    return {
      title: 'Project Not Found - James Petry Portfolio',
      description: 'The requested project could not be found.',
    };
  }
  
  return {
    title: `${project.title} - James Petry Portfolio`,
    description: project.tagline,
    keywords: project.tools || [],
    openGraph: {
      title: project.title,
      description: project.tagline,
      type: 'website',
      // images: project.images?.[0] ? [project.images[0]] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.tagline,
      // images: project.images?.[0] ? [project.images[0]] : [],
    },
  };
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export interface Project {
  id: number;
  title: string;
  tagline: string;
  description: string;
  images: string[];
  imagePositions?: string[]; // Optional array of object-position values (e.g., 'center center', 'top left', '50% 30%')
  category: string;
  year: string;
  tools?: string[];
  link?: string;
  duration?: string;
  // Enhanced fields for 3D and interactivity
  model3D?: string; // Path to 3D model file (.glb/.gltf)
  interactiveDemo?: string; // URL or component identifier for interactive demos
  visualizationData?: VisualizationData; // Data for charts/heatmaps
  metrics?: ProjectMetrics; // Project statistics
  toolDetails?: ToolDetail[]; // Enhanced tool information with proficiency
}

export interface ProjectData {
  projects: Project[];
}

export interface VisualizationData {
  type: 'network' | 'heatmap' | 'chart' | 'metrics';
  data: unknown; // Flexible data structure depending on visualization type
  config?: Record<string, unknown>; // Visualization-specific configuration
}

export interface ProjectMetrics {
  duration?: string;
  iterations?: number;
  apiEndpoints?: number;
  userPersonas?: number;
  toolsUsed?: number;
  [key: string]: string | number | undefined; // Allow additional metrics
}

export interface ToolDetail {
  name: string;
  proficiency?: number; // 0-1 scale
  category?: 'Design' | 'Analysis' | 'Development' | 'Fabrication' | 'Other';
  icon?: string;
}

export interface SkillData {
  name: string;
  proficiency: number; // 0-1 scale
  category: 'Design' | 'Analysis' | 'Development' | 'Fabrication' | 'Other';
}

export interface ToolProficiency {
  name: string;
  proficiency: number; // 0-1 scale
  category: 'Design' | 'Analysis' | 'Development' | 'Fabrication' | 'Other';
  icon?: string;
}


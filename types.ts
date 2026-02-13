
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'game' | 'research' | 'dev';
  link?: string;
  image?: string;
}

export interface HobbyItem {
  id: string;
  type: 'book' | 'movie' | 'music';
  title: string;
  creator: string;
  comment: string;
  rating: number;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  x?: number;
  y?: number;
}

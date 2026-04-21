export type ElementType =
  | 'header' | 'hero' | 'text' | 'image'
  | 'button' | 'card' | 'form' | 'footer'
  | 'divider' | 'columns';

export interface ElementStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  padding?: string;
  margin?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  imageUrl?: string;
  width?: string;
  height?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  opacity?: number;
  boxShadow?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
}

export interface CardItem {
  title?: string;
  text?: string;
  imageUrl?: string;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  order: number;
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    buttonText?: string;
    buttonLink?: string;
    logoText?: string;
    logoImageUrl?: string;
    navLinks?: string[];
    columns?: CanvasElement[][];
    cards?: CardItem[];
  };
  style: ElementStyle;
}

export interface CanvasState {
  elements: CanvasElement[];
  version: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  canvasData: CanvasState;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  role: 'OWNER' | 'EDITOR';
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Member {
  userId: string;
  name: string;
  email: string;
  role: 'OWNER' | 'EDITOR';
  color?: string;
}

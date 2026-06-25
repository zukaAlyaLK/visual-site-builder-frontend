import { api } from './client';
import type { Project, Member } from '../types';
import { useAuthStore } from '../store/auth.store';

export async function getProjects(): Promise<Project[]> {
  const res = await api.get('/projects');
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.projects)) return data.projects;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function createProject(data: { name: string; description?: string }): Promise<Project> {
  const res = await api.post('/projects', data);
  const project = res.data.project ? res.data.project : res.data;
  
  const currentUser = useAuthStore.getState().user;
  project.role = project.ownerId === currentUser?.id ? 'OWNER' : 'EDITOR';
  
  return project;
}

export async function getProject(id: string): Promise<Project> {
  const res = await api.get(`/projects/${id}`);
  const project = res.data.project ? res.data.project : res.data;
  
  const currentUser = useAuthStore.getState().user;
  project.role = project.ownerId === currentUser?.id ? 'OWNER' : 'EDITOR';

  const raw = (project as any).canvasData;
  if (typeof raw === 'string') {
    try {
      project.canvasData = JSON.parse(raw);
    } catch {
      project.canvasData = { elements: [], version: 1 };
    }
  } else if (!raw || typeof raw !== 'object') {
    project.canvasData = { elements: [], version: 1 };
  } else if (!Array.isArray((raw as any).elements)) {
    project.canvasData = { elements: [], version: 1 };
  }
  return project;
}

export async function updateProject(id: string, data: Partial<{ name: string; description: string; canvasData: object }>): Promise<Project> {
  const payload = {
    ...data,
    canvasData:
      data.canvasData && typeof data.canvasData === 'object'
        ? JSON.stringify(data.canvasData)
        : data.canvasData,
  };
  const res = await api.put(`/projects/${id}`, payload);
  const project = res.data.project ? res.data.project : res.data;
  
  const currentUser = useAuthStore.getState().user;
  project.role = project.ownerId === currentUser?.id ? 'OWNER' : 'EDITOR';
  
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}

export async function inviteMember(id: string, email: string): Promise<void> {
  await api.post(`/projects/${id}/invite`, { email });
}

export async function getMembers(id: string): Promise<Member[]> {
  const res = await api.get(`/projects/${id}/members`);
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.members)) return data.members;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function removeMember(projectId: string, userId: string): Promise<void> {
  await api.delete(`/projects/${projectId}/members/${userId}`);
}

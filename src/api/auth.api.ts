import { api } from './client';
import type { User } from '../types';

export async function register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
  const res = await api.post('/auth/register', { email, password, name });
  return res.data;
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me');
  return res.data;
}

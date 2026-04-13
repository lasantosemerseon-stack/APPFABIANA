const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const BASE = `${API_URL}/api`;

async function fetchApi(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok && res.status !== 200) {
    const error = await res.text();
    throw new Error(error);
  }
  return res.json();
}

export async function login(email: string, password: string) {
  return fetchApi('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getModules() {
  return fetchApi('/modules');
}

export async function getModule(moduleId: string) {
  return fetchApi(`/modules/${moduleId}`);
}

export async function getPdfs() {
  return fetchApi('/pdfs');
}

export async function getPdfsByModule(moduleId: string) {
  return fetchApi(`/pdfs/module/${moduleId}`);
}

export async function getMealPlan() {
  return fetchApi('/meal-plan');
}

export async function getDayPlan(day: number) {
  return fetchApi(`/meal-plan/${day}`);
}

export async function getNews() {
  return fetchApi('/news');
}

export async function searchContent(query: string) {
  return fetchApi(`/search?q=${encodeURIComponent(query)}`);
}

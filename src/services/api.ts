interface ApiError {
  error?: string;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('bloodconnect.accessToken');
  const headers = new Headers(options.headers);
  if (options.body) headers.set('content-type', 'application/json');
  if (token) headers.set('authorization', `Bearer ${token}`);

  const response = await fetch(path, { ...options, headers });
  const result = await response.json() as T & ApiError;
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
  return result;
}
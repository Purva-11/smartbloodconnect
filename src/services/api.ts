interface ApiError {
  error?: string;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('bloodconnect.accessToken');
  const headers = new Headers(options.headers);
  if (options.body) headers.set('content-type', 'application/json');
  if (token) headers.set('authorization', `Bearer ${token}`);

  const response = await fetch(path, { ...options, headers });
  const responseText = await response.text();
  let result: T & ApiError;
  try {
    result = JSON.parse(responseText) as T & ApiError;
  } catch {
    throw new Error(response.ok ? 'The server returned an invalid response.' : `Server request failed (${response.status}).`);
  }
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
  return result;
}
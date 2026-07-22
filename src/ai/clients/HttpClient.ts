export interface HttpClient {
  post<T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T>;
}

export class FetchHttpClient implements HttpClient {
  async post<T>(
    url: string,
    body: unknown,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorBody}`);
    }

    return response.json() as Promise<T>;
  }
}

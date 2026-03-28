import { throwResponseErrors } from "@shared/api";

export async function request<T>(
  url: string,
  config: RequestInit = {},
  errorCode?: string,
): Promise<T> {
  const response = await fetch(url, config);

  if (!response.ok) {
    config.signal?.throwIfAborted();
    throwResponseErrors(response.status, errorCode);
  }

  return response.json();
}

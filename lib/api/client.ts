import { z } from "zod";
import { env } from "@/lib/config/env";
import { APIError, NetworkError, ValidationError } from "./errors";

type FetchOptions = RequestInit & {
  next?: NextFetchRequestConfig;
};

async function apiRequest<T>(
  endpoint: string,
  schema: z.ZodSchema<T>,
  options: FetchOptions = {},
): Promise<T> {
  const url = `${env.NEXT_PUBLIC_API_URL}${endpoint}`;

  // Create abort controller for timeout (30 seconds default)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText,
      );
    }

    const data = await response.json();

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError(
        "API response validation failed",
        parsed.error.flatten(),
      );
    }

    return parsed.data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof APIError || error instanceof ValidationError) {
      throw error;
    }

    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NetworkError("Request timed out after 30 seconds", error);
    }

    throw new NetworkError("Network request failed", error);
  }
}

export const api = {
  get: <T>(endpoint: string, schema: z.ZodSchema<T>, options?: FetchOptions) =>
    apiRequest(endpoint, schema, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    schema: z.ZodSchema<T>,
    body?: unknown,
    options?: FetchOptions,
  ) =>
    apiRequest(endpoint, schema, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
};

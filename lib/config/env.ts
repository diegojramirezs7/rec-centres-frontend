import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:8000"),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!parsed.success) {
    // In production, don't log detailed error information
    if (process.env.NODE_ENV === 'development') {
      console.error(
        "Invalid environment variables:",
        parsed.error.flatten().fieldErrors,
      );
    }
    throw new Error("Invalid environment variables. Please check your .env configuration.");
  }

  return parsed.data;
}

export const env = validateEnv();

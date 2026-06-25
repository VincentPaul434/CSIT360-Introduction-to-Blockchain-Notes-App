const getEnv = (key, fallback) => {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const env = {
  port: Number(getEnv("PORT", "4000")),
  clientOrigin: getEnv("CLIENT_ORIGIN", "http://localhost:5173"),
  databaseUrl: process.env.DATABASE_URL ?? null,
};

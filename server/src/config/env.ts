function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  JWT_SECRET: required('JWT_SECRET'),
  DATABASE_URL: required('DATABASE_URL'),
};

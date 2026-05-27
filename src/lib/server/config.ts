export function isDemoMode() {
  return process.env.APP_MODE === "demo" || process.env.NEXT_PUBLIC_APP_MODE === "demo" || process.env.VITE_APP_MODE === "demo";
}

export function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required. Add it to .env.local or set APP_MODE=demo for the sample offline demo.`);
  }
  return value;
}

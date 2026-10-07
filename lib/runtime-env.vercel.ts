// Vercel has no Worker bindings. Database mutations must fail until configured.
export const env: { DB?: D1Database; [key: string]: unknown } = process.env;

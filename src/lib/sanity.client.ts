
// src/lib/sanity.client.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId:  'kk7vh9rn',   // .env.local'dan
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2025-10-24',
  useCdn: true,
});

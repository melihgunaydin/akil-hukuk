import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'kk7vh9rn',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2025-10-24',
  useCdn: false,
});

async function main() {
  const people = await client.fetch(`*[_type=="person"]{name,"slug":slug.current}`);
  const posts = await client.fetch(`*[_type=="post"]{title,"slug":slug.current,publishedAt}`);
  const samplePerson = await client.fetch(
    `*[_type=="person" && slug.current==$slug][0]{name,"slug":slug.current}`,
    { slug: people?.[0]?.slug }
  );
  console.log({ people, posts, samplePerson });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


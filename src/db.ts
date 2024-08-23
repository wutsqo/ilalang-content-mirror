import { createClient } from "@vercel/postgres";
import type { Author, Post } from "./interfaces";

let client: ReturnType<typeof createClient> | null = null;

export async function connect() {
  const DATABASE_URL = process.env.DATABASE_URL as string;
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

  client = createClient({
    connectionString: DATABASE_URL,
  });

  await client.connect();
}

export async function disconnect() {
  if (client) await client.end();
}

export async function getAuthors() {
  if (!client) throw new Error("Database is not connected");
  return await client.sql<Author>`SELECT * FROM "Author";`;
}

export async function getPosts() {
  if (!client) throw new Error("Database is not connected");
  return await client.sql<Post>`SELECT p.id, p.title, a.name  AS author, p."content" FROM PUBLIC."Post" p JOIN PUBLIC."Author" a ON p."authorId" = a."id" WHERE p."published" = TRUE;`;
}

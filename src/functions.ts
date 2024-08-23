export function log(message: string): void {
  console.log(`[${new Date().toISOString()}]: ${message}`);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateFrontmatter(data: Record<string, any>) {
  const frontmatter = Object.entries(data).reduce(
    (acc, [key, value]) => acc + `${key}: "${value}"\n`,
    "---\n"
  );
  return `${frontmatter}---\n`;
}

import { connect, disconnect, getAuthors, getPosts } from "./db";
import { generateFrontmatter, log, slugify } from "./functions";
import { appendFile, readdir } from "node:fs/promises";
import { mdToPdf } from "md-to-pdf";

async function main() {
  try {
    log("⏳ Connecting to the database...");
    await connect();
    log("🤝 Connected to the database");

    log("⏳ Fetching authors...");
    const authors = await getAuthors();
    log(`✅ Fetched ${authors.rowCount} authors`);
    for (const author of authors.rows) {
      const slug = slugify(author.name);
      const frontmatter = generateFrontmatter({
        id: author.id,
        name: author.name,
        profilePicture: author.profilePicture,
        yearOfLife: author.yearOfLife,
        description: author.description,
        slug,
      });
      let content = `${frontmatter}\n`;
      content += `# ${author.name} (${author.yearOfLife})\n\n`;
      content += `${author.description}\n\n`;
      content += `![${author.name}](https://ilalang.drepram.com/${author.profilePicture})\n\n`;
      content += `${author.bio}\n\n`;
      await Bun.write(`./content/${slug}/README.md`, content);
      log(`✅ Created files for author ${slug}`);
    }

    log("⏳ Fetching posts...");
    const posts = await getPosts();
    log(`✅ Fetched ${posts.rowCount} posts`);
    for (const post of posts.rows) {
      const slug = slugify(post.title ?? post.id);
      const authorSlug = slugify(post.author ?? "unknown");
      const frontmatter = generateFrontmatter({
        id: post.id,
        title: post.title,
        author: post.author,
        slug,
      });
      let content = `${frontmatter}\n`;
      content += `# ${post.title}\n\n`;
      content += `${post.content}\n\n`;
      await Bun.write(`./content/${authorSlug}/${slug}.md`, content);
      await appendFile(
        `./content/${authorSlug}/README.md`,
        `\n\n<div class="page-break"></div>\n\n## ${post.title}\n\n${post.content}`
      );
      log(`✅ Created files ./content/${authorSlug}/${slug}.md`);
    }

    const authorDirs = await readdir("./content");
    for (const author of authorDirs) {
      const pdf = await mdToPdf({
        path: `./content/${author}/README.md`,
      }).catch(console.error);
      if (pdf) {
        await Bun.write(`./content/${author}/README.pdf`, pdf.content);
        log(`✅ Created PDF for author ${author}`);
      }
    }
  } catch (error) {
    log(`❌ ${error instanceof Error ? error.message : error}`);
  } finally {
    log("⏳ Disconnecting from the database...");
    await disconnect();
    log("🤝 Disconnected from the database");
    log("👋 All done!");
    process.exit(0);
  }
}

main();

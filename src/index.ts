import { connect, disconnect, getAuthors, getPosts } from "./db";
import { log, slugify } from "./functions";
import matter from "gray-matter";
import { appendFile } from "node:fs/promises";

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
      const url = `[https://ilalang.drepram.com/a/${author.id}](https://ilalang.drepram.com/a/${author.id})`;
      const title = `## ${author.name} (${author.yearOfLife})`;
      const image = `![${author.name}](https://ilalang.drepram.com/${author.profilePicture})`;
      const body = [title, url, author.description, image, author.bio].join(
        "\n\n"
      );
      const markdown = matter.stringify(body, {
        content: {
          id: author.id,
          name: author.name,
          profilePicture: author.profilePicture,
          yearOfLife: author.yearOfLife,
          description: author.description,
          slug,
        },
      });
      await Bun.write(`./content/${slug}/README.md`, markdown);
      log(`✅ Created files for author ${slug}`);
    }

    log("⏳ Fetching posts...");
    const posts = await getPosts();
    log(`✅ Fetched ${posts.rowCount} posts`);

    for (const post of posts.rows) {
      const slug = slugify(post.title ?? post.id);
      const authorSlug = slugify(post.author ?? "unknown");
      const title = `### ${post.title}`;
      const author = `oleh ${post.author}`;
      const url = `[https://ilalang.drepram.com/p/${post.id}](https://ilalang.drepram.com/p/${post.id})`;
      const body = [title, author, url, post.content].join("\n\n");
      const markdown = matter.stringify(body, {
        content: {
          id: post.id,
          title: post.title,
          author: post.author,
          slug,
        },
      });
      await Bun.write(`./content/${authorSlug}/${slug}.md`, markdown);
      await appendFile(`./content/${authorSlug}/README.md`, `\n\n${body}`);
      log(`✅ Created files ./content/${authorSlug}/${slug}.md`);
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

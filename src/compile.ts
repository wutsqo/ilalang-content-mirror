import { readdir, appendFile } from "fs/promises";
import matter from "gray-matter";

async function main() {
  const title = "ilalang -- di antara mutiara";
  const description =
    'Seperti ilalang yang tidak diinginkan petani di ladang mereka, dalam situs ini dihimpun sajak‐sajak dari para "ilalang" dalam semesta sejarah puitika Indonesia. Bukan atas kehendak sendiri, nama dan karya mereka disingkirkan, seluruhnya atas pertimbangan politik ingatan, dibayangi kekerasan negara, yang menjadikan para perangkai kata sebagai pariah, bahkan harus menggelandang puluhan tahun di luar negeri.';
  const markdown = matter.stringify("", {
    title,
    description,
    permalink: "/",
    layout: "base.njk",
    updatedAt: new Date().toISOString(),
  });
  await Bun.write("./content/README.md", markdown);
  const about = await Bun.file("./content/about.md").text();
  const aboutFile = matter(about);
  await appendFile("./content/README.md", aboutFile.content);

  const authors = (await readdir("./content")).filter(
    (author) => !["README.md", "about.md", "README.pdf"].includes(author)
  );
  for (const author of authors) {
    const file = await Bun.file(`./content/${author}/README.md`).text();
    const { content } = matter(file);
    await appendFile("./content/README.md", "\n\n" + content + "\n\n");
  }
}

await main();

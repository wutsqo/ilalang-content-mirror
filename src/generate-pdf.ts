import puppeteer from "puppeteer";

const CURRENT_DIR = process.cwd();
const FILE_PATH = `${CURRENT_DIR}/_site/index.html`;

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${FILE_PATH}`, {
    waitUntil: "networkidle2",
  });
  await page.pdf({
    path: "content/README.pdf",
    printBackground: true,
    waitForFonts: true,
    width: "19cm",
    height: "25cm",
    margin: {
      top: 48,
      right: 36,
      bottom: 48,
      left: 36,
    },
  });
  await browser.close();
}

await main();

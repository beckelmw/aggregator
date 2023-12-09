import Parser from "rss-parser";
import html from "./lib/html.js";
import { createReadStream } from "fs";
import readline from "readline";
import { writeFile, mkdir, cp } from "fs/promises";
import { getDocument } from "./lib/get-document.js";

const parser = new Parser();

const fileStream = createReadStream("./urls.txt");
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

const items = [];

for await (const line of rl) {
  const feed = await parser.parseURL(line);
  feed.items.forEach((i) => {
    i.feedTitle = feed.title;
  });
  items.push(...feed.items);
}

/**
 *
 * @param {import('rss-parser').Item} a
 * @param {import('rss-parser').Item} b
 * @returns
 */
function sortFeed(a, b) {
  if (a.isoDate && b.isoDate) {
    return a.isoDate > b.isoDate ? -1 : 1;
  } else if (a.pubDate && b.pubDate) {
    return new Date(a.pubDate) > new Date(b.pubDate) ? -1 : 1;
  }
  return 1;
}

const content = html`${items.sort(sortFeed).map((item) => {
  return html`<article>
    <header>
      <h1><a href="${item.link}">${item.title}</a></h1>
      <small>${item.feedTitle}</small>
      <small>${item.pubDate}</small>
    </header>
    <main>${item.content}</main>
  </article>`;
})}`;

const result = getDocument(content);

await mkdir("./public", { recursive: true });
await cp("./src/style.css", "./public/style.css");
await cp("./src/favicon.svg", "./public/favicon.svg");
await writeFile("./public/index.html", result, "utf-8");

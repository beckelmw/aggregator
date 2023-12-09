import Parser from "rss-parser";
import html from "./html.js";
import { createReadStream } from "fs";
import readline from "readline";
import { writeFile, mkdir } from "fs/promises";

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

const result = html`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.svg" />
      <meta name="description" content="Bill Beckelman's RSS Reader" />
      <link rel="stylesheet" href="/style.css" />
      <link
        id="code-theme"
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
      />
      <title>Reader</title>
      <script src="https://excerpts.beckelman.net/js/color-mode.js"></script>
      <script src="https://excerpts.beckelman.net/js/hue-selector.js"></script>
    </head>
    <body>
      <nav>
        <a href="/">Reader</a>
        <color-mode></color-mode>
        <hue-selector></hue-selector>
      </nav>
      ${items.sort(sortFeed).map((item) => {
        return html`<article>
          <header>
            <h1><a href="${item.link}">${item.title}</a></h1>
            <small>${item.feedTitle}</small>
            <small>${item.pubDate}</small>
          </header>
          <main>${item.content}</main>
        </article>`;
      })}

      <script>
        Array.from(document.querySelectorAll("pre code")).forEach((code) => {
          code.classList.add("hljs");
        });
      </script>
    </body>
  </html>`;

await mkdir('./public', { recursive: true });
await writeFile("./public/index.html", result, "utf-8");

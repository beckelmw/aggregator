import html from "./html.js";
import { GithubLink } from "./github-link.js";

/**
 *
 * @param {string} content
 * @returns
 */
export function getDocument(content) {
  return html`<!DOCTYPE html>
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
          ${GithubLink}
          <color-mode></color-mode>
          <hue-selector></hue-selector>
        </nav>
        ${content}
        <script>
          Array.from(document.querySelectorAll("pre code")).forEach((code) => {
            code.classList.add("hljs");
          });
        </script>
      </body>
    </html>`;
}

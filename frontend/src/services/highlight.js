import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const CODE_BLOCK_REGEX = /```(\w+)?\n([\s\S]*?)```/g;

export function renderPostContent(raw) {
  if (!raw) return "";

  const parts = [];
  let lastIndex = 0;

  for (const match of raw.matchAll(CODE_BLOCK_REGEX)) {
    const [full, lang, code] = match;
    const start = match.index;
    const end = start + full.length;

    const textBefore = raw.slice(lastIndex, start);
    if (textBefore) {
      parts.push(`<p>${escapeHtml(textBefore).replace(/\n/g, "")}</p>`);
    }

    const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
    const highlighted = hljs.highlight(code, { language }).value;

    parts.push(`
      <pre class="code-block">
        <code class="hljs language-${language}">${highlighted}</code>
      </pre>
    `);

    lastIndex = end;
  }

  const tail = raw.slice(lastIndex);
  if (tail) {
    parts.push(`<p>${escapeHtml(tail).replace(/\n/g, "<br/>")}</p>`);
  }

  return parts.join("");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

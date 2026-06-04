import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_RE = /\*\*([^*]+)\*\*/g;

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "hr" };

function stripHeadingMarks(text: string): string {
  return text.replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
}

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed === "---" || trimmed === "***") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    const h4 = trimmed.match(/^####\s+(.+)$/);
    if (h4) {
      blocks.push({ type: "h4", text: stripHeadingMarks(h4[1]) });
      i++;
      continue;
    }

    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h3) {
      blocks.push({ type: "h3", text: stripHeadingMarks(h3[1]) });
      i++;
      continue;
    }

    const h2 = trimmed.match(/^##\s+(.+)$/);
    if (h2) {
      blocks.push({ type: "h2", text: stripHeadingMarks(h2[1]) });
      i++;
      continue;
    }

    const h1 = trimmed.match(/^#\s+(.+)$/);
    if (h1) {
      blocks.push({ type: "h2", text: stripHeadingMarks(h1[1]) });
      i++;
      continue;
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const bullet = t.match(/^[-*•]\s+(.+)$/);
        if (!bullet) break;
        items.push(bullet[1]);
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const numbered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numbered) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const num = t.match(/^\d+\.\s+(.+)$/);
        if (!num) break;
        items.push(num[1]);
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paraLines: string[] = [trimmed];
    i++;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (
        !next ||
        next.startsWith("#") ||
        next === "---" ||
        /^[-*•]\s+/.test(next) ||
        /^\d+\.\s+/.test(next)
      ) {
        break;
      }
      paraLines.push(next);
      i++;
    }
    blocks.push({ type: "p", text: paraLines.join(" ") });
  }

  return blocks;
}

function toInternalPath(href: string): string | null {
  if (href.startsWith("/")) return href;
  try {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const u = new URL(href, base || undefined);
    if (base && u.origin === base) {
      return `${u.pathname}${u.search}${u.hash}`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function renderLink(label: string, href: string, key: string): ReactNode {
  const internal = toInternalPath(href);
  const className =
    "inline-flex items-center gap-0.5 rounded-md bg-brand-500/10 px-1.5 py-0.5 font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 transition-colors hover:bg-brand-500/15 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200";

  if (internal) {
    return (
      <Link key={key} to={internal} className={className}>
        {label}
      </Link>
    );
  }
  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  );
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  const combined = new RegExp(
    `${LINK_RE.source}|${BOLD_RE.source}`,
    "g"
  );

  let match: RegExpExecArray | null;
  while ((match = combined.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }

    if (match[0].startsWith("[")) {
      nodes.push(renderLink(match[1], match[2], `link-${key++}`));
    } else {
      nodes.push(
        <strong key={`bold-${key++}`} className="font-semibold text-stone-900 dark:text-stone-50">
          {match[1]}
        </strong>
      );
    }
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    const tail = text.slice(cursor).replace(/\*\*/g, "");
    if (tail) nodes.push(tail);
  }

  return nodes.length ? nodes : [text.replace(/\*\*/g, "")];
}

export function AssistantMessage({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = parseBlocks(content);

  return (
    <div
      className={cn(
        "assistant-prose w-full min-w-0 text-sm leading-relaxed text-stone-700 dark:text-stone-200",
        className
      )}
    >
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h3
                key={i}
                className="mb-2 mt-4 font-display text-base font-semibold text-stone-900 first:mt-0 dark:text-stone-50"
              >
                {renderInline(block.text)}
              </h3>
            );
          case "h3":
            return (
              <h4
                key={i}
                className="mb-1.5 mt-3 font-display text-sm font-semibold text-stone-900 first:mt-0 dark:text-stone-50"
              >
                {renderInline(block.text)}
              </h4>
            );
          case "h4":
            return (
              <h5
                key={i}
                className="mb-1 mt-2 text-sm font-semibold text-stone-800 dark:text-stone-100"
              >
                {renderInline(block.text)}
              </h5>
            );
          case "ul":
            return (
              <ul key={i} className="my-2 list-none space-y-2 ps-0">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="my-2 list-decimal space-y-2 ps-5 marker:text-brand-600">
                {block.items.map((item, j) => (
                  <li key={j} className="ps-1">
                    {renderInline(item)}
                  </li>
                ))}
              </ol>
            );
          case "hr":
            return (
              <hr
                key={i}
                className="my-4 border-0 border-t border-stone-200 dark:border-stone-600"
              />
            );
          case "p":
            return (
              <p key={i} className="my-2 last:mb-0">
                {renderInline(block.text)}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

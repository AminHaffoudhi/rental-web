import { Link } from "react-router-dom";
import { PLATFORM_NAME } from "@/config/brand";
import type { LegalBlock, RichPart } from "@/content/legal/types";

function applyName(text: string): string {
  return text.replace(/\{\{name\}\}/g, PLATFORM_NAME);
}

function RichLine({ parts }: { parts: RichPart[] }) {
  return (
    <>
      {parts.map((part, i) =>
        part.type === "link" ? (
          <Link
            key={i}
            to={part.to}
            className="font-semibold text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700 dark:text-brand-400"
          >
            {part.label}
          </Link>
        ) : (
          <span key={i}>{applyName(part.value)}</span>
        )
      )}
    </>
  );
}

export function LegalDocumentBody({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2 key={i}>{applyName(block.text)}</h2>
            );
          case "p":
            return (
              <p key={i}>{applyName(block.text)}</p>
            );
          case "pRich":
            return (
              <p key={i}>
                <RichLine parts={block.parts} />
              </p>
            );
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{applyName(item)}</li>
                ))}
              </ul>
            );
          case "ulRich":
            return (
              <ul key={i}>
                {block.items.map((parts, j) => (
                  <li key={j}>
                    <RichLine parts={parts} />
                  </li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

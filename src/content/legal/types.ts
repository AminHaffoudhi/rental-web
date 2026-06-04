export type RichPart =
  | { type: "text"; value: string }
  | { type: "link"; to: string; label: string };

export type LegalBlock =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "pRich"; parts: RichPart[] }
  | { kind: "ul"; items: string[] }
  | { kind: "ulRich"; items: RichPart[][] };

export type LegalDocument = {
  blocks: LegalBlock[];
};

export type LegalDocId = "terms" | "privacy" | "cookies";

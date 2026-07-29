// components/RichText.tsx

const BASALT_WORKS = "Basalt Works";
const BASALT_WORKS_URL = "https://basaltworks.com/";

function renderTextPart(text: string, keyPrefix: string, accented: boolean) {
  return text.split(/(Basalt Works)/g).map((part, index) => {
    if (!part) return null;

    if (part === BASALT_WORKS) {
      return (
        <a
          key={`${keyPrefix}-${index}`}
          href={BASALT_WORKS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`basalt-link${accented ? " chrome-accent" : ""}`}
        >
          {part}
        </a>
      );
    }

    return accented ? (
      <span key={`${keyPrefix}-${index}`} className="chrome-accent">
        {part}
      </span>
    ) : (
      part
    );
  });
}

/** Renders the dictionary's accent tags and links visible Basalt Works mentions. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(<accent>.*?<\/accent>)/g).map((part, index) => {
        const accented = part.startsWith("<accent>") && part.endsWith("</accent>");
        const content = accented ? part.replace(/<\/?accent>/g, "") : part;

        return renderTextPart(content, `rich-${index}`, accented);
      })}
    </>
  );
}

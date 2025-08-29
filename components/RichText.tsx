// components/RichText.tsx

// Este componente simple busca las etiquetas <accent> y las reemplaza por un <span> con estilo.
export function RichText({ text }: { text: string }) {
  const parts = text.split(/<accent>|<\/accent>/g);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          // El texto dentro de <accent>
          <span key={i} className="text-green-500 font-bold"> {/* <-- Tu clase de CSS para acentuar */}
            {part}
          </span>
        ) : (
          // El texto fuera de <accent>
          part
        )
      )}
    </>
  );
}
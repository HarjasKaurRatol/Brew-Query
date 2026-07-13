// Splits on **bold** markers and wraps matches in <strong>, so dialogue
// content in levelData.js can stay plain strings instead of holding JSX.
export function renderBold(text) {
  return text.split(/(\*\*.+?\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

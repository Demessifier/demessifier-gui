export function addMetaTag(name: string, content: string): HTMLMetaElement {
  const meta: HTMLMetaElement = document.createElement("meta");
  meta.name = name;
  meta.content = content;
  document.head.appendChild(meta);
  return meta;
}

export function ensureMetaTag(
  name: string,
  defaultContent: string
): HTMLMetaElement {
  return (
    document.head.querySelector(`meta[name="${name}"]`) ??
    addMetaTag(name, defaultContent)
  );
}

export function ensureMetaTagContent(
  name: string,
  newContent: string
): HTMLMetaElement {
  const meta = ensureMetaTag(name, newContent);
  return setMetaTagContent(meta, newContent);
}

export function setMetaTagContent(
  meta: HTMLMetaElement,
  content: string
): HTMLMetaElement {
  meta.setAttribute("content", content);
  return meta;
}

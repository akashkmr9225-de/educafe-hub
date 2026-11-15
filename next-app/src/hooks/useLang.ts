export function useLang() {
  if (typeof window === "undefined") return "en";
  const html = document.documentElement;
  return html.lang || "en";
}
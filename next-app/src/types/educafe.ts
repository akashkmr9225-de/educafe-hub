export type Lang = "en" | "hi";

export type LinkItem = [
  code: string,
  name: string,
  english: string,
  hindi: string,
  url: string,
];

export type LinkGroup = {
  c: [string, string];
  items: LinkItem[];
};

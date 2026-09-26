export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}) {
  try {
    if (path.startsWith("//")) return "/";
    if (path.startsWith("/")) return path;
    const url = new URL(path);
    return (
      `${url.hostname && url.protocol !== "https:" && url.protocol !== "http:" ? "/" + url.hostname : ""}${url.pathname}${url.search}` ||
      "/"
    );
  } catch {
    return "/";
  }
}

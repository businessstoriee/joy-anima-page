
// mediaUtils.ts
export function validateUrl(url: string): boolean {
 try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}


export const getEmbedCode = (url: string): string => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.includes("youtube.com")
      ? new URL(url).searchParams.get("v")
      : url.split("/").pop();
    return `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
  }
  return "";
};

import { PlatformAdapter } from "./PlatformAdapter";

/**
 * XAdapter implements PlatformAdapter for X/Twitter posts.
 */
export class XAdapter implements PlatformAdapter {
  private readonly urlPattern = /^(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/.*$/i;

  validateUrl(url: string): boolean {
    return this.urlPattern.test(url);
  }

  parseMetadata(_url: string, html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const twitterDescription = doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content');

    const description = ogDescription || twitterDescription;
    const content = description && description.length <= 180 ? description : '';

    return {
      title: ogTitle,
      description: content,
      image: ogImage,
    };
  }

  getPromptGuide(): string {
    return `You are generating a comment for X (formerly Twitter). Keep it under 180 characters, informal but respectful, and avoid hashtags unless relevant. Use the extracted post description; if missing, request admin input.`;
  }
}

import { PlatformAdapter } from "./PlatformAdapter";

/**
 * InstagramAdapter implements PlatformAdapter for Instagram posts.
 */
export class InstagramAdapter implements PlatformAdapter {
  private readonly urlPattern = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/.*$/i;

  validateUrl(url: string): boolean {
    return this.urlPattern.test(url);
  }

  parseMetadata(_url: string, html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    
    // Instagram often hides descriptions behind login walls, so ogDescription might be generic.
    const description = ogDescription && !ogDescription.toLowerCase().includes("login") ? ogDescription : '';

    return {
      title: ogTitle,
      description: description,
      image: ogImage,
    };
  }

  getPromptGuide(): string {
    return `You are generating a comment for Instagram. Keep it engaging, visually descriptive if possible, use relevant emojis, and keep it brief. If the post description is missing, ask the admin for the original text.`;
  }
}

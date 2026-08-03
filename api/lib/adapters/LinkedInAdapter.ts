import { PlatformAdapter } from "./PlatformAdapter";

/**
 * LinkedInAdapter implements PlatformAdapter for LinkedIn posts.
 * It validates LinkedIn post URLs, extracts useful metadata from the HTML
 * (title, description, image, and main content), and provides a Gemini prompt guide.
 */
export class LinkedInAdapter implements PlatformAdapter {
  private readonly urlPattern = /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/.*$/i;

  validateUrl(url: string): boolean {
    return this.urlPattern.test(url);
  }

  parseMetadata(_url: string, html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Try to extract Open Graph tags first.
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content");
    const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute("content");
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content");

    // LinkedIn often wraps post text in a <meta name="twitter:description"> as well.
    const twitterDescription = doc.querySelector('meta[name="twitter:description"]')?.getAttribute("content");

    // Fallback: attempt to locate the main article body.
    const article = doc.querySelector("article")?.innerText.trim();

    // Filter out typical placeholder snippets like "View LinkedIn post".
    const description = ogDescription || twitterDescription;
    const content = description && !description.toLowerCase().includes("view linked") ? description : article || "";

    return {
      title: ogTitle,
      description: content,
      image: ogImage,
    };
  }

  getPromptGuide(): string {
    return `You are generating a LinkedIn comment. Keep the tone professional, concise (max 2000 characters), and avoid promotional language. Use the extracted post description as context. If the description is missing, ask the admin for the original text.`;
  }
}

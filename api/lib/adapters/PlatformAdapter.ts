export interface PlatformAdapter {
  /** Validate that the URL belongs to the platform */
  validateUrl(url: string): boolean;

  /** Parse metadata from fetched HTML content */
  parseMetadata(url: string, html: string): {
    title?: string;
    description?: string;
    image?: string;
    content?: string;
  };

  /** Returns a prompt guide specific to the platform for Gemini */
  getPromptGuide(): string;
}

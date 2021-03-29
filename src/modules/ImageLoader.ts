interface ImagePair {
  image: HTMLImageElement;
  key: string;
}

export default class ImageLoader {
  /**
   * Loads an image and returns a promise
   * @param src Path to image
   * @param key Single value assigned for
   */
  static load(src: string, key: string): Promise<ImagePair> {
    return new Promise((resolve, reject) => {
      // Create new element
      const image = new Image();

      // Listen for load or error
      image.addEventListener('load', () => resolve({ image, key }));
      image.addEventListener('error', () => {
        reject(`An error occurred while loading image from ${src}`);
      });

      // Lastly, set src
      image.src = src;
    });
  }

  private readonly queue = new Map<string, string>();
  private readonly loaded = new Map<string, HTMLImageElement>();

  /** Adds image to the queue */
  add(key: string, src: string): void {
    this.queue.set(key, src);
  }

  /** Loads all images from the queue. Returns true if operation succeeded */
  async load(): Promise<boolean> {
    const promises = new Set<Promise<ImagePair>>();

    // Clear loaded images map
    this.loaded.clear();

    // Prepare promises
    this.queue.forEach((src, key) => promises.add(ImageLoader.load(src, key)));

    // Load all images
    await Promise.all(promises)
      .then(loaded => loaded.forEach(pair => this.loaded.set(pair.key, pair.image)))
      .catch(console.error);

    return this.queue.size === this.loaded.size;
  }

  /** Returns all loaded images */
  get all(): Map<string, HTMLImageElement> {
    return this.loaded;
  }
}

interface Price {
  price: number;
  label: string | null;
}

/**
 * @class AmazonSearchResult
 * @description An object containing common properties that can be scraped from different Amazon search result
 * formats.
 * @public
 * @property {string} title - Name of product
 * @property {string} productUrl - URL for product details page
 * @property {string} imageUrl - lead product image that shows in search results
 * @property {Array.<[number, number]>} rating - First val is rating, second val is max score, -1 for either means the
 * value could not be found
 * @property {Array.<Price>} prices - Search often lists multiple prices for versions of an item. This is a set of all
 * found prices, some of which have labels attached (for example, if you search a DVD barcode number, there are multiple
 * prices, for DVD, Blu-ray and 4K, and each has a label like "4K"). Price label is null if cannot find it on page
 * @property {boolean} sponsored - whether result is an ad
 */
export default class AmazonSearchResult {
  private _title: string = '';
  private _productUrl: string = '';
  private _imageUrl: string = '';
  private _rating: [number, number] = [-1, -1];
  private _prices: Price[] = [];
  private _sponsored: boolean = false;

  private static extractIsSponsored(block: Element): boolean {
    const sponsorBlock = block.querySelector('.s-info-icon');
    if (!sponsorBlock) {
      return false;
    } else {
      return sponsorBlock.parentElement?.parentElement?.textContent?.toLowerCase().includes('sponsored') || false;
    }
  }

  // not all prices have corresponding subheads
  private static extractPrices(block: Element): Price[] {
    const subheads: HTMLSpanElement[] = Array.from(
      block.querySelectorAll('a.a-text-bold.a-link-normal')
    ) as HTMLSpanElement[];
    const priceStrings: Array<string | undefined> = Array.from(
      block.querySelectorAll('.a-price-whole')
    ).map(elem => elem.parentElement?.textContent?.trim() || '');
    return priceStrings.reduce((prices: Price[], priceString: string | undefined, i: number) => {
      let subhead: Element | undefined;
      if (i < subheads.length) {
        subhead = subheads[i];
      }
      const key: string = subhead?.textContent?.trim() || '';
      if (priceString) {
        prices.push({
          price: parseFloat(priceString.replace(/[^\d.]/g, '')),
          label: key ? key : null
        });
      }
      return prices;
    }, []);
  }

  private static extractRating(block: Element): [number, number] {
    const numbers = block.querySelector('i.a-icon-star-small')?.textContent?.match(/\d(\.\d)?/g)
      ?.map(match => parseFloat(match)) || [-1, -1];
    switch (numbers.length) {
      case 0:
        return [-1, -1];
      case 1:
        numbers.push(-1);
        return numbers as [number, number];
      case 2:
        return numbers as [number, number];
      default:
        return numbers.slice(0, 2) as [number, number];
    }
  }

  constructor(block: Element) {
    this.title = block.querySelector('h2')?.textContent?.trim() || '';
    this.imageUrl = block.querySelector('a img')?.getAttribute('src') || '';
    this.productUrl = block.querySelector('a')?.getAttribute('href') || '';
    this.rating = AmazonSearchResult.extractRating(block);
    this.prices = AmazonSearchResult.extractPrices(block);
    this.sponsored = AmazonSearchResult.extractIsSponsored(block);
  }

  get title(): string {
    return this._title;
  }
  set title(title: string) {
    this._title = title;
  }

  get productUrl(): string {
    return 'https://www.amazon.com' + this._productUrl;
  }
  set productUrl(productUrl: string) {
    this._productUrl = productUrl;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }
  set imageUrl(imageUrl: string) {
    this._imageUrl = imageUrl;
  }

  get rating(): [number, number] {
    return this._rating;
  }
  set rating(rating: [number, number]) {
    this._rating = rating;
  }

  get prices(): Price[] {
    return this._prices;
  }
  set prices(prices: Price[]) {
    this._prices = prices;
  }

  get sponsored(): boolean {
    return this._sponsored;
  }
  set sponsored(sponsored: boolean) {
    this._sponsored = sponsored;
  }

}

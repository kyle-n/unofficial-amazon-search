interface Price {
  price: number;
  label: string | null;
}

interface Rating {
  score: number | null;
  outOf: number | null;
}

/**
 * @class AmazonSearchResult
 * @description An object containing common properties that can be scraped from different Amazon search result
 * formats.
 * @public
 * @property {string} title - Name of product
 * @property {string} productUrl - URL for product details page
 * @property {string} imageUrl - lead product image that shows in search results
 * @property {Array.<Rating>} rating - Score out of a total value
 * @property {Array.<Price>} prices - Search often lists multiple prices for versions of an item. This is a set of all
 * found prices, some of which have labels attached (for example, if you search a DVD barcode number, there are multiple
 * prices, for DVD, Blu-ray and 4K, and each has a label like "4K"). Price label is null if cannot find it on page
 * @property {boolean} sponsored - whether result is an ad
 */
export default class AmazonSearchResult {
  private static domain = 'https://www.amazon.com';

  title: string;
  productUrl: string;
  imageUrl: string;
  rating: Rating = {score: null, outOf: null};
  prices: Price[] = [];
  sponsored = false;

  private static extractIsSponsored(block: Element): boolean {
    const sponsorBlock = block.querySelector('.s-sponsored-label-info-icon');
    if (!sponsorBlock) {
      return false;
    } else {
      return sponsorBlock.parentElement?.parentElement?.textContent?.toLowerCase().includes('sponsored') ?? false;
    }
  }

  // not all prices have corresponding subheads
  private static extractPrices(block: Element): Price[] {
    const subheads: HTMLSpanElement[] = Array.from(
      block.querySelectorAll('a.a-text-bold.a-link-normal')
    ) as HTMLSpanElement[];
    const priceStrings: Array<string | undefined> = Array.from(
      block.querySelectorAll('.a-price-whole')
    ).map(elem => elem.parentElement?.textContent?.trim() ?? '');
    return priceStrings.reduce((prices: Price[], priceString: string | undefined, i: number) => {
      let subhead: Element | undefined;
      if (i < subheads.length) {
        subhead = subheads[i];
      }
      const key: string = subhead?.textContent?.trim() ?? '';
      if (priceString) {
        prices.push({
          price: parseFloat(priceString.replace(/[^\d.]/g, '')),
          label: key ? key : null
        });
      }
      return prices;
    }, []);
  }

  private static extractRating(block: Element): Rating {
    const numbers = block.querySelector('i.a-icon-star-small')?.textContent?.match(/\d(\.\d)?/g)
      ?.map(match => parseFloat(match)) ?? [-1, -1];
    switch (numbers.length) {
      case 0:
        return {score: -1, outOf: -1}
      case 1:
        return {score: numbers[0], outOf: -1};
      default:
        return {score: numbers[0], outOf: numbers[1]}
    }
  }

  constructor(block: Element) {
    this.title = block.querySelector('h2')?.textContent?.trim() ?? '';
    this.imageUrl = block.querySelector('a img')?.getAttribute('src') ?? '';
    this.productUrl = block.querySelector('a')?.getAttribute('href') ?? '';
    this.rating = AmazonSearchResult.extractRating(block);
    this.prices = AmazonSearchResult.extractPrices(block);
    this.sponsored = AmazonSearchResult.extractIsSponsored(block);
  }


  get fullProductUrl(): string {
    return AmazonSearchResult.domain + this.productUrl;
  }

  set fullProductUrl(productUrl: string) {
    if (!productUrl.startsWith(AmazonSearchResult.domain)) {
      throw new Error(`Values assigned to fullProductUrl must start with ${AmazonSearchResult.domain}, assign domainless paths to productUrl`);
    }

    this.productUrl = productUrl.substring(AmazonSearchResult.domain.length);
  }

}

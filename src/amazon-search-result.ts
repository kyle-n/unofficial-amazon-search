interface AmazonSearchResultAttributes {
  title: string;
  productUrl: string;
  imageUrl: string;
  rating: [number, number];
  prices: any;
  extraAttributes: any;
  subtext: string[];
}

export default class AmazonSearchResult implements AmazonSearchResultAttributes {
  private _title: string = '';
  private _productUrl: string = '';
  private _imageUrl: string = '';
  private _rating: [number, number] = [-1, -1];
  private _prices: any = null;
  private _extraAttributes: any = null;
  private _subtext: string[] = [];

  private static extractPrices(block: Element): Record<string, number> {
    const subheads: HTMLSpanElement[] = Array.from(
      block.querySelectorAll('a.a-text-bold.a-link-normal')
    ) as HTMLSpanElement[];
    const priceStrings: string[] = Array.from(
      block.querySelectorAll('.a-price-whole')
    ).map(elem => elem.parentElement?.textContent?.trim() || '');
    return subheads.reduce((prices: Record<string, number>, subhead: HTMLSpanElement, i: number) => {
      const priceString = priceStrings[i];
      const key: string = subhead.textContent?.trim() || '';
      if (key) {
        prices[key] = parseFloat(priceString.replace(/[^\d.]/g, ''));
      }
      return prices;
    }, {});
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

  get prices(): any {
    return this._prices;
  }
  set prices(prices: any) {
    this._prices = prices;
  }

  get extraAttributes(): any {
    return this._extraAttributes;
  }
  set extraAttributes(extraAttributes: any) {
    this._extraAttributes = extraAttributes;
  }

  get subtext(): string[] {
    return this._subtext;
  }
  set subtext(subtext: string[]) {
    this._subtext = subtext;
  }
}
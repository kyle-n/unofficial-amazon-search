interface AmazonSearchResultAttributes {
  title: string;
  productUrl: string;
  imageUrl: string;
  rating: string;
  prices: any;
  extraAttributes: any;
  subtext: string;
}

export default class AmazonSearchResult implements AmazonSearchResultAttributes {
  private _title: string = '';
  private _productUrl: string = '';
  private _imageUrl: string = '';
  private _rating: string = '';
  private _prices: any = null;
  private _extraAttributes: any = null;
  private _subtext: string = '';

  constructor() {
  }

  get title(): string {
    return this._title;
  }
  set title(title: string) {
    this._title = title;
  }

  get productUrl(): string {
    return this._productUrl;
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

  get rating(): string {
    return this._rating;
  }
  set rating(rating: string) {
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

  get subtext(): string {
    return this._subtext;
  }
  set subtext(subtext: string) {
    this._subtext = subtext;
  }
}
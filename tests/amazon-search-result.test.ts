import {AmazonSearchResult} from '../src';
import getSampleResult from './SampleResultHtml';

describe('AmazonSearchResult', () => {

  let sampleResult: AmazonSearchResult;

  beforeEach(() => {
    const element = document.createElement('div');
    element.innerHTML = getSampleResult();
    sampleResult = new AmazonSearchResult(element);
  });

  it('finds the title', () => {
    const productTitle = 'USB A to Type C Cable, Cabepow [3-Pack 6ft] Fast Charging USB Type C Cord for Samsung Galaxy '
      + 'A10/A20/A51/S10/S9/S8, Type C Charger Premium Nylon Braided USB Cable (Gray)';
    expect(sampleResult.title).toBe(productTitle);
  });

  it('finds the productUrl', () => {
    const productUrl = '/Cabepow-Charging-Samsung-Charger-Premium/dp/B08D6N9C2L/ref=sr_1_62'
      + '?dchild=1&keywords=usb+cable&qid=1606162912&sr=8-62';
    expect(sampleResult.productUrl).toBe(productUrl);
  });

  it('calculates fullProductUrl', () => {
    const fullUrl = 'https://www.amazon.com/Cabepow-Charging-Samsung-Charger-Premium/dp/B08D6N9C2L/ref=sr_1_62'
      + '?dchild=1&keywords=usb+cable&qid=1606162912&sr=8-62';
    expect(sampleResult.fullProductUrl).toBe(fullUrl);
  });

  it('finds the imageUrl', () => {
    const imageUrl = 'https://m.media-amazon.com/images/I/71JJj2nPcAL._AC_UY218_.jpg';
    expect(sampleResult.imageUrl).toBe(imageUrl);
  });

  it('finds the rating', () => {
    expect(sampleResult.rating).toEqual({score: 4.7, outOf: 5});
  });

  it('finds if sponsored', () => {
    expect(sampleResult.sponsored).toBe(false);
  });

  it('errors if assigning a fullProductUrl without leading domain', () => {
    let errorThrown = false;
    try {
      sampleResult.fullProductUrl = sampleResult.productUrl;
    } catch {
      errorThrown = true;
    }
    expect(errorThrown).toBe(true);
  });

  it('accepts a fullProductUrl', () => {
    let errorThrown = false;
    try {
      sampleResult.fullProductUrl = 'https://www.amazon.com/Console-console-Routers-Router-Windows/dp/B075V1RGQK/ref=sr_1_63'
        + '?dchild=1&keywords=usb+cable&qid=1606162912&sr=8-63';
    } catch {
      errorThrown = true;
    }
    expect(errorThrown).toBe(false);
  });

  it('finds the prices', () => {
    expect(sampleResult.prices).toEqual([{price: 12.99, label: null}]);
  });

});

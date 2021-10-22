import {searchAmazon, AmazonSearchResult} from '../src';

fdescribe('searchAmazon', () => {

  const anySponsored = (searchResults: AmazonSearchResult[]): boolean => {
    return searchResults.reduce((atLeastOneSponsored, result) => {
      return atLeastOneSponsored || result.sponsored;
    }, false);
  }

  it('should load page 1 by default', async () => {
    const data = await searchAmazon('usb cable');
    expect(data.pageNumber).toBe(1);
  });

  it('should filter sponsored results by default', async () => {
    const data = await searchAmazon('usb cable');
    expect(anySponsored(data.searchResults)).toBe(false);
  });

  it('should get all expected results', async () => {
    const data = await searchAmazon('usb cable');
    const firstTitle = 'UGREEN Ethernet Adapter USB 2.0 to 10/100 Network RJ45 LAN Wired Adapter Compatible for Nintendo Switch, '
      + 'Wii, Wii U, MacBook, Chromebook, Windows, Mac OS, Surface, Linux ASIX AX88772 Chipset (Black)';
    const lastTitle = 'USB Type-C Cable 5pack 6ft Fast Charging 3A Rapid Charger Quick Cord, Type C to A Cable 6 Foot Compatible '
      + 'Galaxy S10 S9 S8 Plus, Braided Fast Charging Cable for Note 10 9 8, LG V50 V40 G8 G7';

    expect(data.searchResults.length).toBe(16);
    expect(data.searchResults[0].title).toBe(firstTitle);
    expect(data.searchResults[data.searchResults.length - 1].title).toBe(lastTitle);
  });

  it('should include sponsored results if given the flag', async () => {
    const data = await searchAmazon('usb cable', {includeSponsoredResults: true});
    
    expect(anySponsored(data.searchResults)).toBe(true);
    expect(data.searchResults.length).toBe(22);
  });

  it('should load a given page if given that page', async () => {
    const data = await searchAmazon('usb cable', {page: 2});
    expect(data.pageNumber).toBe(2);
  });

  it('should have a next page function when there is a next page', async () => {
    const data = await searchAmazon('usb cable');
    expect(data.getNextPage).toBeTruthy();
  });

});

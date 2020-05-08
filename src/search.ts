import fetch from 'isomorphic-fetch';
import {JSDOM} from 'jsdom';
import AmazonSearchResult from './amazon-search-result';

function extractResults(virtualDom: JSDOM): AmazonSearchResult[] {
  const resultNodeList = virtualDom.window.document.querySelectorAll('div[data-component-type="s-search-result"]');
  const searchResultBlocks: Element[] = Array.from(resultNodeList);
  return searchResultBlocks.map(searchResultBlock => {
    const parsedResult = new AmazonSearchResult();
    parsedResult.title = searchResultBlock.querySelector('h2')?.textContent?.trim() || '';
    parsedResult.productUrl = searchResultBlock.querySelector('a img')?.getAttribute('src') || '';
    parsedResult.productUrl = ('https://www.amazon.com' + searchResultBlock.querySelector('a')?.getAttribute('href')) || '';
    parsedResult.subtext = '';
    parsedResult.rating = '';
    parsedResult.prices = null;
    parsedResult.extraAttributes = null;
    return parsedResult;
  });
}

export default async function searchAmazon(query: string): Promise<AmazonSearchResult[]> {
  const resp = await fetch(`https://www.amazon.com/s?k=${encodeURIComponent(query)}&ref=nb_sb_noss`);
  const pageText = await resp.text();
  return extractResults(new JSDOM(pageText));
}

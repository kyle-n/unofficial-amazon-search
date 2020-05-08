import fetch from 'isomorphic-fetch';
import {JSDOM} from 'jsdom';
import AmazonSearchResult from './amazon-search-result';

function extractResults(virtualDom: JSDOM): AmazonSearchResult[] {
  const resultNodeList = virtualDom.window.document.querySelectorAll('div[data-component-type="s-search-result"]');
  const searchResultBlocks: Element[] = Array.from(resultNodeList);
  return searchResultBlocks.map(searchResultBlock => {
    return new AmazonSearchResult(searchResultBlock);
  });
}

export default async function searchAmazon(query: string): Promise<AmazonSearchResult[]> {
  const resp = await fetch(`https://www.amazon.com/s?k=${encodeURIComponent(query)}&ref=nb_sb_noss`);
  const pageText = await resp.text();
  return extractResults(new JSDOM(pageText));
}

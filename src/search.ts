import fetch from 'isomorphic-fetch';
import {JSDOM} from 'jsdom';
import AmazonSearchResult from './amazon-search-result';

/**
 * @name extractResults
 * @description Converts raw HTML to AmazonSearchResult instances for easier parsing
 * @param {JSDOM} virtualDom - JSDOM instance of search results page
 * @returns {Array.<AmazonSearchResult>}
 */
function extractResults(virtualDom: JSDOM): AmazonSearchResult[] {
  const resultNodeList = virtualDom.window.document.querySelectorAll('div[data-component-type="s-search-result"]');
  const searchResultBlocks: Element[] = Array.from(resultNodeList);
  return searchResultBlocks.map(searchResultBlock => {
    return new AmazonSearchResult(searchResultBlock);
  });
}

/**
 * @name searchAmazon
 * @description Scrapes the first page of Amazon search results
 * @public
 * @param {string} query - What you'd type in to the Amazon search bar
 * @param {boolean=} includeSponsoredResults - Filters sponsored results by default
 * @returns {Promise<Array.<AmazonSearchResult>>}
 */
export default async function searchAmazon(query: string, includeSponsoredResults?: boolean): Promise<AmazonSearchResult[]> {
  const resp = await fetch(`https://www.amazon.com/s?k=${encodeURIComponent(query)}&ref=nb_sb_noss`);
  const pageText = await resp.text();
  let searchResults = extractResults(new JSDOM(pageText));
  if (!includeSponsoredResults) {
    searchResults = searchResults.filter(result => !result.sponsored);
  }
  return searchResults;
}

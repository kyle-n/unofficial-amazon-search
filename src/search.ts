import fetch from 'isomorphic-fetch';
import {JSDOM} from 'jsdom';
import AmazonSearchResult from './amazon-search-result';
// @ts-ignore
import {isBrowser} from 'browser-or-node';

interface AllOriginsResponse {
  contents: string; // html string
  status: {
    content_length: null;
    content_type: string;
    http_code: null;
    response_time: number;
    url: string;
  }
}

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

function queryToRequest(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&ref=nb_sb_noss`;
}

function queryToProxiedRequest(query: string): string {
  let url = queryToRequest(query);
  return 'http://api.allorigins.win/get?url=' + encodeURIComponent(url);
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
  let pageHtml: string;
  if (isBrowser) {
    const resp = await fetch(queryToProxiedRequest(query));
    const body: AllOriginsResponse = await resp.json();
    pageHtml = body.contents;
  } else {
    const resp: Response = await fetch(queryToRequest(query));
    pageHtml = await resp.text();
  }
  let searchResults = extractResults(new JSDOM(pageHtml))
  if (!includeSponsoredResults) {
    searchResults = searchResults.filter(result => !result.sponsored);
  }
  return searchResults;
}

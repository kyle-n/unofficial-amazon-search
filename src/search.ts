import fetch from 'isomorphic-fetch';
import {isBrowser} from 'browser-or-node';
import {JSDOM} from 'jsdom';
import AmazonSearchResult from './amazon-search-result';
import htmlStringToDOMElement from './dom-parser';

/**
 * Polyfills SharedArrayBuffer, which is disabled in Firefox (off by default), IE, Opera, Safari, and a whole host of
 * other browsers because of Spectre vulnerability exploits.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
 */
if (isBrowser) {
  const sab: any = function () {};
  sab.prototype.byteLength = {};
  sab.prototype.byteLength.get = () => {
    throw new Error('Browser does not support SharedArrayBuffer');
  };
  window.SharedArrayBuffer = sab;
}

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
 * @param {ParentNode} elem - Node element containing search results, whether real DOM or JSDOM
 * @returns {Array.<AmazonSearchResult>}
 */
function extractResults(elem: ParentNode): AmazonSearchResult[] {
  const resultNodeList = elem.querySelectorAll('div[data-component-type="s-search-result"]');
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
async function searchAmazon(
  query: string,
  includeSponsoredResults?: boolean
): Promise<AmazonSearchResult[]> {
  let searchResults: Array<AmazonSearchResult>;
  if (isBrowser) {
    const resp: Response = await fetch(queryToProxiedRequest(query));
    const body: AllOriginsResponse = await resp.json();
    const pageHtml = body.contents;
    searchResults = extractResults(htmlStringToDOMElement(pageHtml));
  } else {
    const resp: Response = await fetch(queryToRequest(query));
    const pageHtml = await resp.text();
    const virtualDOM = new JSDOM(pageHtml);
    searchResults = extractResults(virtualDOM.window.document);
  }
  if (!includeSponsoredResults) {
    searchResults = searchResults.filter(result => !result.sponsored);
  }
  return searchResults;
}

export default searchAmazon;

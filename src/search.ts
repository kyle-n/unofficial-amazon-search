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

function queryToRequest(query: string, page?: number): string {
  const queryParams: string[] = [
    `k=${encodeURIComponent(query)}`,
    page ? `ref=sr_pg_${page}` : 'nb_sb_noss',
  ];
  if (page && page > 1) queryParams.push(`page=${page}`)

  return `https://www.amazon.com/s?${queryParams.join('&')}`;
}

function queryToProxiedRequest(query: string, page?: number): string {
  let url = queryToRequest(query, page);
  return 'http://api.allorigins.win/get?url=' + encodeURIComponent(url);
}

function hasNextPage(elem: ParentNode, currentPage?: number): boolean {
  const nextPage = (currentPage ?? 1) + 1;
  const nextLink = elem.querySelector(`a[href*="page=${nextPage}"]`);
  return Boolean(nextLink);
}

interface SearchData {
  searchResults: Array<AmazonSearchResult>;
  pageNumber: number;
  getNextPage?: () => Promise<SearchData>;
}

interface SearchConfig {
  page: number;
  includeSponsoredResults: boolean;
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
  config?: Partial<SearchConfig>
): Promise<SearchData> {

  const currentPage = config?.page ?? 1;
  const searchData: SearchData = {
    searchResults: [],
    pageNumber: currentPage,
    getNextPage: undefined
  };
  let documentNode: ParentNode;

  if (isBrowser) {
    const resp: Response = await fetch(queryToProxiedRequest(query, config?.page));
    const body: AllOriginsResponse = await resp.json();
    const pageHtml = body.contents;
    documentNode = htmlStringToDOMElement(pageHtml);
  } else {
    const resp: Response = await fetch(queryToRequest(query, config?.page));
    const pageHtml = await resp.text();
    const virtualDOM = new JSDOM(pageHtml);
    documentNode = virtualDOM.window.document;
  }

  searchData.searchResults = extractResults(documentNode);

  if (hasNextPage(documentNode, config?.page)) {
    searchData.getNextPage = () => searchAmazon(query, config);
  }

  if (!config?.includeSponsoredResults) {
    searchData.searchResults = searchData.searchResults.filter(result => !result.sponsored);
  }
  return searchData;
}

export default searchAmazon;

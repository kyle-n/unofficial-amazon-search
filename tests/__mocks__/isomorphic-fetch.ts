import getSamplePageHtml from '../sample-page-html';
import {AllOriginsResponse} from '../../src/search';

const fetch = (url: string) => {
  const mockResponse: AllOriginsResponse = {
    contents: getSamplePageHtml(),
    status: {
      content_length: null,
      content_type: 'text/html',
      http_code: null,
      response_time: 1,
      url
    }
  };

  return {
    json: () => Promise.resolve(mockResponse)
  };
}

export default fetch;

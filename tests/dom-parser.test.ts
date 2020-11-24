import htmlStringToDOMElement from '../src/dom-parser';
import getSampleResult from './SampleResultHtml';

describe('dom-parser', () => {

  it('puts an html string into a container div', () => {
    const div = htmlStringToDOMElement(getSampleResult());
    expect(div.tagName.toLowerCase()).toBe('div');
    expect(div.children.length).toBeGreaterThan(0);
  });

});

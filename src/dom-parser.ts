const htmlStringToDOMElement = (html: string): HTMLDivElement => {
  const containerDiv = document.createElement('div');
  containerDiv.setAttribute('style', 'display: none;');
  containerDiv.innerHTML = html;
  return containerDiv;
};

export default htmlStringToDOMElement;

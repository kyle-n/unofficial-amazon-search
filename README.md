# unofficial-amazon-search
A simple client for searching Amazon

## Install

`npm install unofficial-amazon-search`

or

`yarn add unofficial-amazon-search`

## How to use

`searchAmazon` returns `Promise<SearchData>`.

```typescript
import {searchAmazon, AmazonSearchResult} from 'unofficial-amazon-search';
// OR
const {searchAmazon, AmazonSearchResult} = require('unofficial-amazon-search');

searchAmazon('anything you would put in the search bar').then(data => {
  console.log(data);
  console.log(data.pageNumber)    // 1
  console.log(data.searchResults[0].title, data.searchResults[0].imageUrl);
});

// load other pages by specifying a page number
// or calling getNextPage()
searchAmazon('mad max', {page: 2, includeSponsoredResults: true}).then(data => {
  console.log(data.pageNumber)    // 2
  console.log(data.searchResults) // (page 2 results)
  return data.getNextPage();
}).then(data => {
  console.log(data.searchResults) // (page 3 results)
});
```

The above works in Node and frontend environments with compiled code.

`unofficial-amazon-search` can also be imported from a `<script>` tag and used in raw JS. Importing it will attach the
module to the `window` object. Browser queries are proxied through AllOrigins.win, a limit-free proxy, to avoid CORS issues.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My beautiful webpage</title>
  <meta charset="UTF-8">
</head>
<body></body>
<script src="path/to/unofficial-amazon-search/_bundles/unofficial-amazon-search.min.js" rel="script"></script>
<script>
  var searchAmazon = window.UnofficialAmazonSearch.searchAmazon;
  searchAmazon('123').then(function (data) {
    console.log(data.searchResults);
  });
</script>
</html>
```

The bundle contains minified and non-minified bundles of the compiled search code.

This is a Promise-based API and does not support callbacks, so you will have to roll your own solution for Internet Explorer.

## API

### Function `searchAmazon`

Parameters:

- `query` - string that you'd put into the Amazon website search bar
- `config` - optional object, can specify any (or none) of the properties on `SearchConfig`.

Returns a `Promise<SearchData>`.

### Interface `SearchConfig`

- `page`: - desired page of results
- `includeSponsoredResults` - set `true` to include ads

### Interface `SearchData`

An object with properties:

- `searchResults`: `Array<AmazonSearchResult>`
- `pageNumber`: Page number of current set of `searchResults`
- `getNextPage`: If there is another page of results for the given query, this function returns a Promise for that next page. If there is no next page, this is undefined.

### Class `AmazonSearchResult`

![A diagram of an Amazon search result annotated by property (includes price labels)](./assets/example-1.png)

![A diagram of an Amazon search ad annotated by property (no price labels)](./assets/example-2.png)

1. `imageUrl` - lead product image that shows in search results
2. `title` - name of product  
`productUrl` - URL for product details page
3. `rating` - x out of y possible score (e.x. 4.2 out of 5)
4. `prices` - Search often lists multiple prices for versions of an item. This is a set of all found prices, some of 
which have labels attached (for example, if you search a DVD barcode number, there are multiple prices, for DVD, Blu-ray
and 4K, and each has a label like "4K"). Price label is null if cannot find it on page
5. `sponsored` - whether result is an ad. `searchAmazon` filters out these by default

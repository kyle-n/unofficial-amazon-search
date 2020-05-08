import searchAmazon from './search';

  document.addEventListener('DOMContentLoaded', () => {
    console.log('searched!')
    searchAmazon('asdf').then(x => {
      console.log(x)
      console.log(x.text())
    })
  });

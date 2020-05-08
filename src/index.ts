import searchAmazon from './search';

  document.addEventListener('DOMContentLoaded', () => {
    console.log('searched!')
    searchAmazon('031398276401').then(x => {
      console.log(x, 'raw resp')
    });
  });

import fetch from 'isomorphic-fetch';

export default async function searchAmazon(query: string): Promise<any> {
  console.log(query);
  const config: any = {
    method: 'GET',
    url: 'https://www.amazon.com/s?k=031398276401&ref=nb_sb_noss'
  };
  return await fetch(config);
}

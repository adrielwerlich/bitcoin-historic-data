export async function fetchData(selectedCoin = 'bitcoin', days) {
  let url = `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=CG-FE1QgAQty3ZF89P1VdhEFPPT`;

  const response = await fetch(url);
  const data = await response.json();
  return data.prices;
}

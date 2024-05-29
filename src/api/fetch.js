const key = 'CG-FE1QgAQty3ZF89P1VdhEFPPT';

export async function fetchData(selectedCoin = 'bitcoin', days) {
  let url = `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${key}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.prices;
}

export async function fetchBitcoinPriceAtMoment(selectedDateTime) {
  if (!selectedDateTime) {
    console.error("Please select a date and time.");
    return;
  }

  const date = new Date(selectedDateTime);
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`; // Convert to dd-mm-yyyy format

  const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formattedDate}&x_cg_demo_api_key=${key}`);
  const data = await response.json();
  return data;
};
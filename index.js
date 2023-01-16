const ccxt = require('ccxt');
const moment = require('moment');
const delay = require('delay');
//const Chart = require('chart.js');

binance = new ccxt.binance({
    apiKey: 'q9sSUaMViMlu6BeOT9Qrx3WstpFLmZoGKHwPEFYZrLEzTcp534ifwxS9VobzUcYB',
    secret: 'rt4fmqqsxN9UpiCQoum9IzNL9QgsoI0W2TGYjGTPZzy79h5gY16WCxVwjgSRZIlL'
});
binance.setSandboxMode(true);

async function printBalance(btcPrice) {
  const balance = await binance.fetchBalance();
  const total = balance.total;
  console.log(`Balance : BTC ${total.BTC}, USDT: ${total.USDT}`);
  console.log(`Total USDT : ${(total.BTC - 1) * btcPrice + total.USDT}.\n`);
  
}

async function tick() {
  const prices = await binance.fetchOHLCV('BTC/USDT', '1m', undefined, '5');
  const bPrices = prices.map((price) => {
    return {
      timestamp: moment(price[0]).format(),
      open: price[1],
      high: price[2],
      low: price[3],
      close: price[4],
      volume: price[5],
    };
  });
  
  const averagePrice = bPrices.reduce((acc, price) => acc + price.close, 0) / 5;
  const lastPrice = bPrices[bPrices.length - 1].close;

  console.log(bPrices.map((p) => p.close), averagePrice, lastPrice);
  //tt
  const direction = lastPrice > averagePrice ? 'sell' : 'buy';

  const TRADE_SIZE = 100;
  const quantity = TRADE_SIZE / lastPrice;

  console.log(`Average price : ${averagePrice}. Last price: ${lastPrice}`);
  const order = await binance.createMarketOrder('BTC/USDT', direction, quantity);
  console.log(`${moment().format()}: ${direction} ${quantity} BTC at ${lastPrice}`);
  //chartPrices(bPrices);
  

  //draw(lastPrice); //call the draw function and pass the lastPrice as an argument

  //console.log(order);
  printBalance(lastPrice);
}

async function main() {
  while (true) {
    await tick();
    await delay(60 * 1000);
  }
}

main();

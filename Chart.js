const Chart = require('chart.js');

async function createChart() {
    // Read the trade data from the file
    const tradeData = JSON.parse(fs.readFileSync('tradeData.json', 'utf-8'));

    // Create the chart data
    const chartData = {
        labels: tradeData.map((trade) => trade.timestamp),
        datasets: [{
            label: 'Price',
            data: tradeData.map((trade) => trade.price),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    // Create the chart
    new Chart(document.getElementById("myChart"), {
        type: 'line',
        data: chartData,
        options: {}
    });
}

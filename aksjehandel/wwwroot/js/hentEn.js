let dbAksje;
let funnetAksje;
const id = window.location.search.substring(1);
window.onload = function() {
    const url = "Aksje/HentAksje?" + id;
    $.get(url, function(aksje) {
      dbAksje = aksje;
      fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d')
      .then((response) => response.json())
      .then((data) => createHTML(data));
    });
}

function createHTML(aksjer) {
  for (i = 0; i < aksjer.length; i++) {
    if (dbAksje.symbol.toLowerCase() == aksjer[i].symbol) {
      funnetAksje = aksjer[i];
    }
  }
  console.log(funnetAksje)
  fetch(`https://api.coingecko.com/api/v3/coins/${funnetAksje.id}/market_chart?vs_currency=usd&days=30&interval=daily`)
  .then((response) => response.json())
  .then((data) => createChart(data));

  let diulatedPercentage = (funnetAksje.fully_diluted_valuation)/(funnetAksje.market_cap);
  let diulated = funnetAksje.fully_diluted_valuation;
  if (funnetAksje.fully_diluted_valuation == null) {
      diulated = 0;
  }
  let colorDiulated,colorMarket,updownDiulated, updownMarket;
  if (funnetAksje.market_cap_change_percentage_24h < 0) {
      colorMarket = 'red';
      updownMarket = 'down';
  } else {
      colorMarket = 'green';
      updownMarket = 'up';
  }

  if (diulatedPercentage < 0) {
      colorDiulated = 'red';
      updownDiulated = 'down';
  } else {
      colorDiulated = 'green';
      updownDiulated = 'up';
  }

  let bodyCoins = document.getElementsByClassName("body-coins")[0];
  bodyCoins.innerHTML = 
    `
      <div class="status-info">
        <div class="status-coin">
            <h3>Highest (24hr): <span>$ ${funnetAksje.high_24h.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></h3>
            <p>Lowest (24hr): <span>$ ${funnetAksje.low_24h.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></p>
        </div>
        <div class="status-coin">
            <h3>Value: <span>$ ${dbAksje.pris.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></h3>
            <p>Value Change (24hr): <span>$ ${funnetAksje.price_change_24h.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></p>
        </div>
        <div class="status-coin">
            <h3>Market Cap:<span></span>$ ${funnetAksje.market_cap.toLocaleString(undefined, {maximumFractionDigits: 2})}</h3>
            <p>Market Cap Change: <span>$ ${funnetAksje.market_cap_change_24h.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></p>
        </div>
        <div class="status-coin">
            <h3>Max supply: <span>${Math.round(funnetAksje.total_supply).toLocaleString(undefined, {maximumFractionDigits: 2})}</span></h3>
            <p>Circulating supply:${Math.round(funnetAksje.circulating_supply).toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
        </div>
        <div class="status-coin">
            <h3>Last Updated:</h3>
            <p>${funnetAksje.last_updated}</p>
        </div>
      </div>

      <div class="status-coin-info">
        <div class="db-info">
            <div class="db-header-coin">
                <img style="border-radius: 100%;" src="${dbAksje.image}" height="50px" width="50px">
                <h3>${dbAksje.aksjenavn}</h3>
            </div>
            <div class="db-info-coin">
                <div class="db-info-about">
                    <p style="font-size: 11px; font-weight: 700; color: gray;">Market Cap</p>
                    <p style="font-weight: 700; font-size: 12px">$ ${funnetAksje.market_cap.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                    <p style="color: ${colorMarket};font-size: 11px; font-weight: 700"><i style="margin-right: 5px; font-size: 14px;"class="fa fa-caret-${updownMarket}" aria-hidden="true"></i></i>${funnetAksje.market_cap_change_percentage_24h.toLocaleString(undefined, {maximumFractionDigits: 2})}%</p> 
                </div>
                <div class="db-info-about">
                    <p style="font-size: 11px; font-weight: 700; color: gray;">Fully Diluted Market Cap</p>
                    <p style="font-weight: 700; font-size: 12px">$ ${funnetAksje.market_cap.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                    <p style="color: ${colorDiulated};font-size: 11px; font-weight: 700"><i style="margin-right: 5px; font-size: 14px;"class="fa fa-caret-${updownDiulated}" aria-hidden="true"></i></i>${diulatedPercentage.toLocaleString(undefined, {maximumFractionDigits: 2})}%</p> 
                </div>
                <div class="db-info-about">
                    <p style="font-size: 11px; font-weight: 700; color: gray;">Volume</p>
                    <p style="font-weight: 700; font-size: 12px">$ ${funnetAksje.total_volume.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                </div>
            </div>
            <div class="converter">
                <div class="converter-cont">
                    <section>
                        <div>
                            <div class="firstInp" style="overflow: hidden;">
                                <div class="inpCont" style="order: 1;">
                                    <img src="${dbAksje.image}" alt="" class="currencyImg">
                                    <div class="inpCryptoText">
                                        <p class="POSot">BTC</p>
                                        <p class="converter-item-name" color="text" >Bitcoin</p>
                                    </div>
                                    <div class="inpCryptoCont">
                                        <input oninput="calcPrice()" pattern="/^-?d+.?d*$/" placeholder="0" class="inpCrypto">
                                    </div>
                                </div>
                                <div class="secondInp" style="order: 2;">
                                    <img src="https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/USD.svg" alt="" class="currencyImg">
                                    <div class="inpCryptoText">
                                        <p class="POSot">USD</p>
                                        <p class="converter-item-name" color="text" >United States Dollar</p>
                                    </div>
                                    <div class="inpCryptoCont">
                                        <input pattern="/^-?d+.?d*$/" placeholder="0" class="inpCrypto" readonly>
                                    </div>
                                </div>
                                <img src="https://s2.coinmarketcap.com/static/cloud/img/converter.png?_=b8777e5">
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        <div class="chart">
            <div class="chartTxt">
                <h3>Prices Changes Last 30 days</h3>
            </div>
            <div class="chart1"> 
                <canvas id="myChart" style="width:100%;max-width:700px"></canvas>
            </div>
        </div>
      </div>
    `;
}

function calcPrice() {
    let inpCrypto = document.getElementsByClassName("inpCrypto")[0];
    let Crypto = document.getElementsByClassName("inpCrypto")[1];
    let pris = dbAksje.pris * inpCrypto.value;
    Crypto.value = pris.toLocaleString(undefined, {maximumFractionDigits: 2});
}

function createChart(chart) {
    console.log(chart);
    let xValues = [];
    let yValues = [];
    let max = 0;
    let min = 999999;
    for (i = 0; i < chart.prices.length; i++) {
        if (chart.prices[i][1] > max) {
            max = chart.prices[i][1];
        } else if (chart.prices[i][1] < min) {
            min = chart.prices[i][1];
        }
        yValues[i] = chart.prices[i][1];
        xValues[i] = i;
    }

    
    new Chart("myChart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
          fill: false,
          lineTension: 0,
          backgroundColor: "#9568FF",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues
        }]
      },
      options: {
        legend: {display: false},
        scales: {
          yAxes: [{ticks: {min: min, max:max*1.02}}],
        }
      }
    });
}


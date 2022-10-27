const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '65057d1335msh82e2fdcf14b3731p1e4bcfjsn149c5de9ee62',
		'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
	}
};

let dbAksje;
let funnetAksje;
let formPurchase;

const id = window.location.search.substring(1);
window.onload = run();
function run()  {
    const url = "Aksje/HentAksje?" + id;
    $.get(url, function(aksje) {
      dbAksje = aksje;
      fetch(`https://twelve-data1.p.rapidapi.com/quote?symbol=${dbAksje.symbol}&interval=1day&outputsize=30&format=json`, options)
      .then(response => response.json())
      .then(response => createHTML(response));
    });
}

async function createHTML(aksjer) {
    const timeSeries = await fetch(`https://twelve-data1.p.rapidapi.com/time_series?symbol=${aksjer.symbol}&interval=1day&outputsize=30&format=json`, options)
    getTimeseries = await timeSeries.json();
    let highColor, lowColor,updownLow, updownHigh;
    if (parseFloat(aksjer.fifty_two_week.low_change_percent) > 0) {
        lowColor = 'green';
        updownLow = 'up';
    } else {
        lowColor = 'red';
        updownLow = 'down';
    }
    
    if (parseFloat(aksjer.fifty_two_week.high_change_percent) > 0) {
        highColor = 'green';
        updownHigh = 'up';
    } else {
        highColor = 'red';
        updownHigh = 'down';
    }
    
    let bodyCoins = document.getElementsByClassName("body-coins")[0];
    bodyCoins.innerHTML = 
    `
      <div class="status-info">
        <div class="status-coin">
            <h3>Highest (24hr): <span>$ ${parseFloat(aksjer.high).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</span></h3>
            <p>Lowest (24hr): <span>$ ${parseFloat(aksjer.low).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</span></p>
        </div>
        <div class="status-coin">
            <h3>Value: <span>$ ${parseFloat(dbAksje.pris).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</span></h3>
            <p>Value Change (24hr): <span>$ ${parseFloat(aksjer.change).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</span></p>
        </div>
        <div class="status-coin">
            <h3>Open Last 24hr : <span>$ ${parseFloat(aksjer.open).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</span></h3>
            <p>Closed Last 24hr: <span>$ ${parseFloat(aksjer.close).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</span></p>
        </div>
        <div class="status-coin">
            <h3>Last Updated: </h3>
            <p>${aksjer.datetime}</p>
        </div>
      </div>

      <div class="status-coin-info">
        <div class="db-info">
            <div class="db-header-coin">
                <h3>${dbAksje.aksjenavn}</h3>
            </div>
            <div class="db-info-coin">
                <div class="db-info-about">
                    <p class="pTitle" style="font-weight: 700; color: gray;">Last 52 weeks High</p>
                    <p class="pValue" style="font-weight: 700;">$ ${parseFloat(aksjer.fifty_two_week.high).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</p>
                    <p class="pPercent" style="color: ${highColor};font-weight: 700"><i style="margin-right: 5px; font-size: 14px;"class="fa fa-caret-${updownHigh}" aria-hidden="true"></i></i>${parseFloat(aksjer.fifty_two_week.high_change_percent).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}%</p> 
                 </div>
                <div class="db-info-about">
                    <p class="pTitle" style="font-weight: 700; color: gray;">Last 52 weeks Low</p>
                    <p class="pValue" style="font-weight: 700;">$ ${parseFloat(aksjer.fifty_two_week.low).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</p>
                    <p class="pPercent" style="color: ${lowColor}; font-weight: 700"><i style="margin-right: 5px; font-size: 14px;"class="fa fa-caret-${updownLow}" aria-hidden="true"></i></i>${parseFloat(aksjer.fifty_two_week.low_change_percent).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}%</p> 
                </div>
                <div class="db-info-about">
                    <p class="pTitle" style="font-weight: 700; color: gray;">Range (Low to High)</p>
                    <p class="pValue" style="font-weight: 700;">$ ${parseFloat(aksjer.fifty_two_week.low).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})} - ${parseFloat(aksjer.fifty_two_week.high).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</p>
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
                                        <p class="POSot">${dbAksje.symbol}</p>
                                    </div>
                                    <div class="inpCryptoCont">
                                        <input oninput="calcPrice()" pattern="/^-?d+.?d*$/" placeholder="0" class="inpCrypto">
                                    </div>
                                </div>
                                <div class="secondInp" style="order: 2;">
                                    <img src="https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/USD.svg" alt="" class="currencyImg">
                                    <div class="inpCryptoText">
                                        <p class="POSot">USD</p>
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
            <div class="cont-purchase">
                
            </div>
        </div>
        <div class="chart">
            <div class="chart1"> 
                <div id="chartContainer"></div>
            </div>
        </div>
      </div>
    `;

    let contPurchase = document.getElementsByClassName("cont-purchase")[0];
    if (localStorage.length > 0) {
        contPurchase.innerHTML = 
        `
        <form action="" id="formPurchase">
            <div>
                <label for="name">Amount</label>
            </div>
            <div>
                <input type="number" name="amount" class="inpAmount" placeholder="Maximum 1500 at a time" min=0 max=1500 required>
            </div>
            <div>
                <input type="submit" class="purchaseBtn" value="Purchase">
            </div>
        </form>
        `;
    formPurchase = document.getElementsByClassName("purchaseBtn")[0];
    let antall = document.getElementsByClassName("inpAmount")[0];
    antall.addEventListener('input', function() {
        if (antall.value > 1500) {
            antall.value = 1500;
        }
    });
    formPurchase.addEventListener("click", function(event) {
        event.preventDefault();
        const url = "Aksje/LagreBestilling"
        $.get("Aksje/HentKunder", function(data) {
            for (i = 0; i < data.length; i++) {
                if (data[i].kId == parseInt(localStorage.getItem('kId'))) {
                    console.log(data[i])
                    let bestilling = {
                        antall: antall.value,
                        kunder: data[i],
                        aksjer: dbAksje
                    }
                    $.post(url, bestilling, function(verify) {
                        if (verify) {
                            window.location.href="index.html";
                        } else {
                            alert(
                                `
                                Du har ikke nok beløp i kontoen
                                Beløp: $ ${bestilling.kunder.balance.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                Pris: $ ${(dbAksje.pris*antall.value).toLocaleString(undefined, {maximumFractionDigits: 2})}
                                `
                                );
                        }
                    });
                }   
            }
        });
      });
    };
    createChart(getTimeseries);
}



function calcPrice() {
    let inpCrypto = document.getElementsByClassName("inpCrypto")[0];
    let Crypto = document.getElementsByClassName("inpCrypto")[1];
    let pris = dbAksje.pris * inpCrypto.value;
    Crypto.value = pris.toLocaleString(undefined, {maximumFractionDigits: 2});
}



function createChart(chart) {
    let xValues = [];
    let yopenValues = [];
    let ycloseValues = [];
    let max = 0;
    let min = 999999;
    for (i = 0; i < chart.values.length; i++) {
        if (chart.values[i].high > max) {
            max = chart.values[i].high;
        } else if (chart.values[i].low < min) {
            min = chart.values[i].low;
        }
        yopenValues[i] = chart.values[i].open;
        ycloseValues[i] = chart.values[i].close;
        xValues[i] = chart.values[i].datetime;
    }

    var options = {
        series: [{
        name: 'Open',
        data: yopenValues
      }, {
        name: 'Close',
        data: ycloseValues
      }],
        chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: xValues
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
      };

      var chart = new ApexCharts(document.querySelector("#chartContainer"), options);
      chart.render();
}


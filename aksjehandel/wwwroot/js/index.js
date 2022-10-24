fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d')
  .then((response) => response.json())
  .then((data) => LagreData(data));

let cryptoCount = 12;

function LagreData(aksjer) {
    const url = "Aksje/HentAlle";
    $.get(url, function(data) {
        if (data.length > 0 && data.length == cryptoCount) {
            let formaterPrise = formaterPriser(data)
            formaterData(formaterPrise);
        } else {            
            let temp;
            for (i = 0; i < aksjer.length; i++) {
                for (j = 0; j < aksjer.length; j++) {
                    if (aksjer[i].current_price > aksjer[j].current_price) {
                        temp = aksjer[i];
                        aksjer[i] = aksjer[j];
                        aksjer[j] = temp;
                    }
                }
            }
            let sendAksje = [];
            for (i = 0; i < cryptoCount; i++) {
                let aksje = {
                    id: i+1,
                    symbol: aksjer[i].symbol.toUpperCase(),
                    aksjenavn: aksjer[i].name,
                    pris: Math.round(aksjer[i].current_price),
                    stock: Math.round(aksjer[i].circulating_supply),
                    image: aksjer[i].image
                };                
                sendAksje[i] = aksje;
                const url = "Aksje/Lagre";
                $.post(url, sendAksje[i], function (OK) {
                    if (OK) {
                        formaterData(sendAksje);
                    }
                    else {
                        $("#feil").html("Feil i db - prøv igjen senere");
                    }
                });
            }
            formaterData(sendAksje);
        }
    });
}


function formaterData(aksjer) {
    let bodyCoins = document.getElementsByClassName("body-coins")[0];
    bodyCoins.innerHTML = "";
    for (i = 0; i < aksjer.length; i++) {
        bodyCoins.innerHTML += `
        <div class="coin-container">
            <div class="coin-info">
                <img src="${aksjer[i].image}" class="coinImg">
                <div class="coin-infos">
                    <div class="cont">
                        <p>Coin: <span class="coin">${aksjer[i].aksjenavn}</span></p>
                        <p>Symbol: <span class="symbol">${aksjer[i].symbol}</span></p>
                        <p>Price: <span class="price">$${aksjer[i].pris}</span></p>
                        <p>Supply: <span class="circulatingSupply">${aksjer[i].stock}</span></p>
                    </div>
                </div>

                <div class="coin-button">
                    <div class="button-vMore">
                        <button value="${aksjer[i].id}" onclick='hentEn(${aksjer[i].id})' class="vMore" id="vMore">View More</button>
                    </div>
                    <div class="button-purchase">
                        <button value="${aksjer[i].id}" class="purchase" id="purchase">Purchase</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

function hentEn(id) {
    window.location.href=`hentEn.html?id=${id}`;
}


function formaterPriser(priser) {
    for (i = 0; i < priser.length; i++) {
        for (j = 0; j < priser.length; j++) {
            if (priser[i].pris > priser[j].pris) {
                temp = priser[i];
                priser[i] = priser[j];
                priser[j] = temp;
            }
        }
    }

    return priser;
}
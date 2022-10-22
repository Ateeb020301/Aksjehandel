fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d')
  .then((response) => response.json())
  .then((data) => LagreData(data));


function LagreData(aksjer) {
    console.log(aksjer); 
    let bodyCoins = document.getElementsByClassName("body-coins")[0];
    let nyAksjer = {};
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

    for (i = 0; i < 12; i++) {
        bodyCoins.innerHTML += `
        <div class="coin-container">
            <div class="coin-info">
                <img src="${aksjer[i].image}" class="coinImg">
                <div class="coin-infos">
                    <div class="cont">
                        <p>Coin: <span class="coin">${aksjer[i].name}</span></p>
                        <p>Symbol: <span class="symbol">${aksjer[i].symbol.toUpperCase()}</span></p>
                        <p>Price: <span class="price">$${Math.round(aksjer[i].current_price)}</span></p>
                        <p>Circulating Supply: <span class="circulatingSupply">${Math.round(aksjer[i].circulating_supply)}</span></p>
                    </div>
                </div>

                <div class="coin-button">
                    <div class="button-vMore">
                        <button id="vMore">View More</button>
                    </div>
                    <div class="button-purchase">
                        <button id="purchase">Purchase</button>
                    </div>
                </div>
            </div>
        </div>
        `
        nyAksjer[i] = aksjer[i];
    }
    leggInn(nyAksjer);
}

function leggInn(aksjer) {
    let aksje = aksjer;
    const url = "Aksje/LeggInn";
    $.post(url, aksje, function(verify) {
        if (verify) {
            console.log(aksje);
        } else {
            console.log(`ID ${nr} ERROR`)
        }
    });
}




  /*
window.onload = function () {
    hentAlleKunder();
}

function hentAlleKunder() {
    $.get("aksje/hentAlle", function (aksjer) {
        formaterAksjer(aksjer);
    });
}

function formaterAksjer(aksjer) {
    let ut = "<table class='table table-striped'>" +
        "<tr>" +
        "<th>Navn</th><th>Pris</th><th>Stock</th><th></th><th></th>" +
        "</tr>";
    for (let aksje of aksjer) {
        ut += "<tr>" + 
            "<td>" + aksje.aksjenavn + "</td>" +
            "<td>" + aksje.pris + "</td>" +
            "<td>" + aksje.stock + "</td>" +
            "<td> <a class='btn btn-primary' href='endre.html?id=" + aksje.id+"'>Endre</a></td>"+
            "<td> <button class='btn btn-danger' onclick='slettKunde(" + aksje.id+")'>Slett</button></td>"+
            "</tr>";
    }
    ut += "</table>";
    $("#kundene").html(ut);
}

function slettKunde(id) {
    const url = "Kunde/Slett?id="+id;
    $.get(url, function (OK) {
        if (OK) {
            window.location.href = 'index.html';
        }
        else {
            $("#feil").html("Feil i db - prøv igjen senere");
        }

    });
};
*/
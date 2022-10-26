const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '65057d1335msh82e2fdcf14b3731p1e4bcfjsn149c5de9ee62',
		'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
	}
};
let info = document.getElementsByClassName("info")[0];
let balance = document.getElementsByClassName("balance")[0];
let select = document.getElementById("name");

let rolle = document.getElementById("role");
let profil = document.getElementById("profil");
let amount = 0;
let kundeArr;
//HUSK LOCALSTORAGE
window.onload = function() {
    const url = "Aksje/HentKunder";
    $.get(url, function(data) {
        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                select.innerHTML +=
                `
                <option value="${data[i].kId}">${data[i].kNavn}</option>
                `;
            }
            kundeArr = data;
            if (localStorage.length > 0) {
                profil.style.display="block";
                select.selectedIndex = localStorage.getItem('selectedIndex');
                rolle.innerHTML = kundeArr[select.selectedIndex-1].rolle;
                balance.innerHTML = kundeArr[select.selectedIndex-1].balance.toLocaleString();
                profil.innerHTML = 
                `
                <a href="endre.html?id=${localStorage.getItem('kId')}">Profile</a>
                `
            }
            select.selectedIndex = localStorage.getItem('selectedIndex');
        } else {
            profil.style.display = "none";
                select.selectedIndex = 0;
        }
    });
}


select.onchange = function change() {
    profil.style.display = "block";
    for (i = 0; i < kundeArr.length; i++) {
        if (select[select.selectedIndex].value == kundeArr[i].kId) {
            rolle.innerHTML = kundeArr[i].rolle;
            balance.innerHTML = kundeArr[i].balance.toLocaleString();
            localStorage.setItem('kId', `${kundeArr[i].kId}`);
            localStorage.setItem('navn', `${kundeArr[i].kNavn}`);
            localStorage.setItem('rolle', `${kundeArr[i].rolle}`);
            localStorage.setItem('balance', `${kundeArr[i].balance}`);
            localStorage.setItem('selectedIndex', `${select.selectedIndex}`);
            profil.innerHTML = 
            `
            <a href="endre.html?id=${kundeArr[i].kId}">Profile</a>
            `
        }
    }

}

fetch('https://twelve-data1.p.rapidapi.com/stocks?exchange=NASDAQ&format=json',options)
  .then((response) => response.json())
  .then((data) => LagreData(data));

let aksjeView = 12;
function LagreData(aksjer) {
    const url = "Aksje/HentAlle";
    $.get(url, async function(data) {
        if (data.length > 0 && data.length == aksjeView) {
            formaterData(data);
        } else { 
            let temp = 0;
            let sendAksje = [];
            for (i = 0; i < aksjeView; i++) {
                let boolLogo = true;
                let tempNum;
                let getLogo;
                let getPrices;
                while (boolLogo) {
                    const prices = await fetch(`https://twelve-data1.p.rapidapi.com/price?symbol=${aksjer.data[temp].symbol}&format=json&outputsize=30`, options)
                    getPrices = await prices.json();
                    const logo = await fetch(`https://twelve-data1.p.rapidapi.com/logo?symbol=${aksjer.data[temp].symbol}`, options)
                    getLogo = await logo.json();
                    
                    if (temp == 8 || temp == 9)  {
                        tempNum = temp;
                        temp = tempNum + i + Math.floor(Math.random()*9+10);
                        const prices = await fetch(`https://twelve-data1.p.rapidapi.com/price?symbol=${aksjer.data[temp].symbol}&format=json&outputsize=30`, options)
                        getPrices = await prices.json();
                        const logo = await fetch(`https://twelve-data1.p.rapidapi.com/logo?symbol=${aksjer.data[temp].symbol}`, options)
                        getLogo = await logo.json();
                        temp = tempNum
                    }

                    if (aksjer.data[temp].symbol != 'AAME' && aksjer.data[temp].symbol != 'AAOI' && aksjer.data[temp].symbol != 'ABGI') {
                        if (getLogo.url != '') {
                            let aksje = {
                                id: temp,
                                symbol: aksjer.data[temp].symbol,
                                aksjenavn: aksjer.data[temp].name,
                                exchange: aksjer.data[temp].exchange,
                                pris: Math.round(getPrices.price),
                                image: getLogo.url
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
                            boolLogo = false;
                        }
                    }
                    temp++;
                }
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
                        <p>Exchange: <span class="coin">${aksjer[i].exchange}</span></p>
                        <p>Name: <span class="coin">${aksjer[i].aksjenavn}</span></p>
                        <p>Symbol: <span class="coin">${aksjer[i].symbol}</span></p>
                        <p>Price: <span class="price">$${aksjer[i].pris}</span></p>
                    </div>
                </div>

                <div class="coin-button">
                    <div class="button-vMore">
                        <button value="${aksjer[i].id}" onclick='hentEn(${aksjer[i].id})' class="vMore" id="vMore">View More</button>
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

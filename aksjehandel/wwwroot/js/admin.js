
let bestRad = document.getElementsByClassName("bestTabell")[0];
let kundeRad = document.getElementsByClassName("kundeTabell")[0];
let info = document.getElementsByClassName("info")[0];
let balance = document.getElementsByClassName("balance")[0];
let select = document.getElementById("name");
let rolle = document.getElementById("role");
let profil = document.getElementById("profil");

window.onload = function() {
    if (localStorage.getItem('rolle') != 'Admin') {
        window.location.href="index.html";
    } else {
        hentBestillinger();
        kunder();
    }  
}

function hentBestillinger() {
    const url = "Aksje/HentBestillinger";
    $.get(url, function(data) {
        bestRad.innerHTML = '';
        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                console.log(data);
                bestRad.innerHTML += 
                `
                <tr>
                    <td>${data[i].kunder.kNavn}</td>
                    <td>${data[i].bId}</td>
                    <td>${data[i].aksjer.symbol}</td>
                    <td>${data[i].aksjer.aksjenavn}</td>
                    <td>$${data[i].aksjer.pris}</td>
                    <td>${data[i].antall}</td>
                    <td>$${(data[i].aksjer.pris)*data[i].antall}</td>
                    <td><button onclick="slett(${data[i].bId})" id="selg" >Selg</button></td>
                </tr>
                `;
            }
        } 
    });
}

function kunder() {
    const url = "Aksje/HentKunder";
    $.get(url, function(data) {
        kundeRad.innerHTML = '';
        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                    kundeRad.innerHTML += 
                    `
                    <tr>
                        <td>${data[i].kNavn}</td>
                        <td>${data[i].tlfNummer}</td>
                        <td>${data[i].rolle}</td>
                        <td>$ ${data[i].balance.toLocaleString()}</td>
                        <td><button onclick="slettKunde(${data[i].kId})" id="selg" >Slett</button></td>
                    </tr>
                    `;
            }
        } 
    });
}

function slett(id) {
    let bestilling = {
        bId: id
    }
    const url = "Aksje/SlettHeleBestilling";
    $.post(url, bestilling, function(verify) {
        if (verify) {
            window.location.href="admin.html";
        } else {
            console.log("Feil i DB - Prøv igjen");
        }
    });


}

function slettKunde(id) {
    let kunde = {
        kId: id
    }
    const url = "Aksje/SlettKunde";
    if (id == localStorage.getItem('kId')) {
        alert("Du kan ikke slette deg selv!")
    } else {
        $.post(url, kunde, function(verify) {
            if (verify) {
                window.location.href="admin.php";
            } else {
                console.log("Feil i DB - Prøv igjen");
            }
        });
    
    }

}
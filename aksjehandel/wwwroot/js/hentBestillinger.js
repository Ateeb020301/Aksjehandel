let balance = document.getElementsByClassName("balance")[0];
let select = document.getElementById("name");
let rolle = document.getElementById("role");
let profil = document.getElementById("profil");
let bestRad = document.getElementsByClassName("bestTabell")[0];
let admin = document.getElementById("admins");

window.onload = function() {
    if (localStorage.getItem('rolle') == "Admin") {
        admin.style.display="";
    } else {
        admin.style.display="none";
    }
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
                rolle.innerHTML = kundeArr[localStorage.getItem('selectedIndex')-1].rolle;
                balance.innerHTML = kundeArr[localStorage.getItem('selectedIndex')-1].balance.toLocaleString();
                profil.innerHTML = 
                `
                <a href="endre.html?id=${localStorage.getItem('kId')}">Profile</a>
                `
            }
            select.selectedIndex = localStorage.getItem('selectedIndex');
        } else {
            profil.style.display = "none";
        }
    });
    hentBestillinger();
}

function hentBestillinger() {
    const url = "Aksje/HentBestillinger";
    $.get(url, function(data) {
        bestRad.innerHTML = '';
        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                if (data[i].kunder.kId == parseInt(localStorage.getItem('kId'))) {
                    bestRad.innerHTML += 
                    `
                    <tr>
                        <td><img width="30%" src="${data[i].aksjer.image}"></td>
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
        } 
    });
}

function slett(id) {
    window.location.href=`slettBestilling.html?id=${id}`;
}

select.onchange = function test() {
    profil.style.display = "block";
    for (i = 0; i < kundeArr.length; i++) {
        if (select[select.selectedIndex].value == kundeArr[i].kId) {
            rolle.innerHTML = kundeArr[i].rolle;
            balance.innerHTML = kundeArr[i].balance.toLocaleString();
            localStorage.setItem('kId', `${kundeArr[i].kId}`)
            localStorage.setItem('navn', `${kundeArr[i].kNavn}`)
            localStorage.setItem('rolle', `${kundeArr[i].rolle}`)
            localStorage.setItem('balance', `${kundeArr[i].balance}`)
            localStorage.setItem('selectedIndex', `${select.selectedIndex}`)
            profil.innerHTML = 
            `
            <a href="endre.html?id=${kundeArr[i].kId}">Profile</a>
            `
        }
    }
    if (localStorage.getItem('rolle') == "Admin") {
        admin.style.display="";
    } else {
        admin.style.display="none";
    }
    hentBestillinger();
}
let info = document.getElementsByClassName("info")[0];
let balance = document.getElementsByClassName("balance")[0];
let select = document.getElementById("name");
let rolle = document.getElementById("role");
let profil = document.getElementById("profil");

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
    hentBestillinger();
}


function hentBestillinger() {
    const url = "Aksje/HentBestillinger";
    $.get(url, function(data) {
        bestRad.innerHTML = '';
        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                console.log(data[i]);
                if (data[i].kunder.kId == localStorage.getItem('kId')) {
                    console.log("yes")
                    bestRad.innerHTML += 
                    `
                    <tr>
                        <td><img src="${data[i].aksjer.image}"></td>
                        <td>${data[i].bId}</td>
                        <td>${data[i].aksjer.symbol}</td>
                        <td>${data[i].aksjer.aksjenavn}</td>
                        <td>$${data[i].aksjer.pris}</td>
                        <td>${data[i].antall}</td>
                        <td>$${(data[i].aksjer.pris)*data[i].antall}</td>
                        <td><button id="selg" >Selg</button></td>
                    </tr>
                    `;
                }
                
            
            }
        } 
    });
}
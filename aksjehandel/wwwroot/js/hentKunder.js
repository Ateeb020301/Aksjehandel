let kundeRad = document.getElementsByClassName("kundeTabell")[0];
let admin = document.getElementById("admins");
let info = document.getElementsByClassName("info")[0];
let balance = document.getElementsByClassName("balance")[0];
let select = document.getElementById("name");
let rolle = document.getElementById("role");
let profil = document.getElementById("profil");

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

    kunder();
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
    if (localStorage.getItem('rolle') == "Admin") {
        admin.style.display="";
    } else {
        admin.style.display="none";
    }
    kunder();
}

function kunder() {
    const url = "Aksje/HentKunder";
    $.get(url, function(data) {
        kundeRad.innerHTML = '';
        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                if (data[i].kId == localStorage.getItem('kId')) {
                    kundeRad.innerHTML += 
                    `
                    <tr>
                        <td class="active">${data[i].kNavn}</td>
                        <td class="active">${data[i].tlfNummer}</td>
                        <td class="active">${data[i].rolle}</td>
                        <td class="active">$ ${data[i].balance.toLocaleString()}</td>
                        <td class="active" style="color:green;">Online</td>
                    </tr>
                    `;
                } else {
                    kundeRad.innerHTML += 
                    `
                    <tr>
                        <td>${data[i].kNavn}</td>
                        <td>${data[i].tlfNummer}</td>
                        <td>${data[i].rolle}</td>
                        <td>$ ${data[i].balance.toLocaleString()}</td>
                        <td style="color:red;">Offline</td>
                    </tr>
                    `;
                }
            }
        } 
    });
}

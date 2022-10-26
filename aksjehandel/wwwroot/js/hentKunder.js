let balance = document.getElementsByClassName("balance")[0];
let select = document.getElementById("name");
let rolle = document.getElementById("role");
let profil = document.getElementById("profil");

window.onload = function() {
    const url1 = "Aksje/HentKunder";
    $.get(url1, function(data) {
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
    
}
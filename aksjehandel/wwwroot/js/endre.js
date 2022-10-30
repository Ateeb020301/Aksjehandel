let formEndre = document.getElementById("formEndre");
let inpId = document.getElementById("inpId");
let inpNavn = document.getElementById("inpNavn");
let inpTlf = document.getElementById("inpTlf");
let role = document.getElementsByName("rolle")
let checkedVal;
window.onload = function() {
    const id = window.location.search.substring(1);
    const url = `Aksje/HentKunde?${id}`;
    $.get(url, function(kunde) {
        inpId.value = kunde.kId;
        inpNavn.value = kunde.kNavn;
        inpTlf.value = kunde.tlfNummer;
        for (i = 0; i < select.length; i++) {
            if (kunde.balance == select[i].value) {
                select.selectedIndex = i;
            }
        }

        for (i = 0; i < role.length; i++) {
            if (role[i].value == kunde.rolle) {
                role[i].checked = true;
            }
        }
    });
}

formEndre.onsubmit = function(evt) {
    evt.preventDefault();
    for (i = 0; i < role.length; i++) {
        if (role[i].checked) {
            checkedVal = role[i].value;
        }
    }
    let kunde = {
        kId: inpId.value,
        kNavn: inpNavn.value,
        tlfNummer: inpTlf.value,
        rolle: checkedVal,
        balance: select.value
    }
    localStorage.setItem('kId', `${kunde.kId}`);
    localStorage.setItem('navn', `${kunde.kNavn}`);
    localStorage.setItem('rolle', `${kunde.rolle}`);
    localStorage.setItem('balance', `${kunde.balance}`);
    const url = "Aksje/EndreKunde"
    $.post(url, kunde, function(verify) {
        if (verify) {
            window.location.href="index.html";
        } else {
            alert("Feil i db - prøv igjen senere");
        }
    })
}
let formEndre = document.getElementById("formEndre");
let inpkId = document.getElementById("inpkId");
let inpbId = document.getElementById("inpbId");
let inpNavn = document.getElementById("inpNavn");
let inpaNavn = document.getElementById("inpaNavn");
let inpAntall = document.getElementById("inpAntall");
const id = window.location.search.substring(1);

window.onload = function() {
    const url = `Aksje/HentBestilling?${id}`;
    $.get(url, function(bestilling) {
        console.log(bestilling)
        inpkId.value = bestilling.kunder.kId;
        inpbId.value = bestilling.bId;
        inpNavn.value = bestilling.kunder.kNavn;
        inpaNavn.value = bestilling.aksjer.aksjenavn;

    });
}

function run() {
    inpAntall.value = inpAntall.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    const url = `Aksje/HentBestilling?${id}`;
    $.get(url, function(bestilling) {
        console.log(bestilling)
        if (inpAntall.value > bestilling.antall) {
            console.log("test")
            inpAntall.value = bestilling.antall;
        }
    });
}

formEndre.onsubmit = function(evt) {
    evt.preventDefault();
    let selg = {
        bId: inpbId.value,
        antall: inpAntall.value
    }

    console.log(selg)
    const url = "Aksje/SlettBestilling"
    $.post(url, selg, function(verify) {
        if (verify) {
            window.location.href="index.html";
        } else {
            alert("Feil i db - prøv igjen senere");
        }
    })
}

let select = document.getElementById("cash");
let inpNavn = document.getElementById("inpNavn");
let inpTlf = document.getElementById("inpTlf");
let inpAdmin = document.getElementById("admin");
let inpMember = document.getElementById("member");
let form = document.getElementById("myForm");
let checked;

form.onsubmit = function sendinn(evt) {
    evt.preventDefault();

    if (inpAdmin.checked) {
        checked = inpAdmin.value
    } else if (inpMember.checked) {
        checked = inpMember.value
    }

    let kunde = {
        kNavn: inpNavn.value,
        tlfNummer: inpTlf.value,
        rolle: checked,
        balance: select.value
    };                
    const url = "Aksje/LagreKunde";
    $.post(url, kunde, function (OK) {
        if (OK) {
            window.location.href="index.html"
        }
        else {
            $("#feil").html("Feil i db - prøv igjen senere");
        }
    });

}


